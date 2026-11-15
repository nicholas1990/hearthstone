import { Injectable, Logger, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { BlizzardCard, mapCards, Metadata, MetaEntry } from './blizzard.mapper';
import { Card } from './card';

interface Token {
  value: string;
  expiresAt: number;
}

interface CardsPage {
  cards: BlizzardCard[];
  pageCount: number;
}

interface CacheFile {
  savedAt: number;
  cards: Card[];
}

const PAGE_SIZE = 500;

@Injectable()
export class BlizzardService {
  private readonly log = new Logger(BlizzardService.name);
  private token: Token | null = null;
  private memory: CacheFile | null = null;
  private inflight: Promise<CacheFile> | null = null;

  constructor(private readonly config: ConfigService) {}

  get savedAt(): number | null {
    return this.memory?.savedAt ?? null;
  }

  get configured(): boolean {
    return !!this.config.get('BLIZZARD_CLIENT_ID') && !!this.config.get('BLIZZARD_CLIENT_SECRET');
  }

  /** Le carte dalla cache (memoria, poi file) se ancora valide, altrimenti da Blizzard. */
  async cards(force = false): Promise<Card[]> {
    const ttl = Number(this.config.get('CACHE_TTL_HOURS') ?? 12) * 3_600_000;
    const fresh = (c: CacheFile | null): c is CacheFile => !!c && Date.now() - c.savedAt < ttl;

    if (!force && fresh(this.memory)) return this.memory.cards;
    if (!force) {
      const onDisk = await this.readFile();
      if (fresh(onDisk)) {
        this.memory = onDisk;
        return onDisk.cards;
      }
    }
    this.inflight ??= this.refresh().finally(() => (this.inflight = null));
    try {
      return (await this.inflight).cards;
    } catch (e) {
      // meglio carte vecchie che nessuna carta
      const stale = this.memory ?? (await this.readFile());
      if (stale) {
        this.log.warn(`Aggiornamento fallito (${(e as Error).message}): uso la cache scaduta`);
        return stale.cards;
      }
      throw e;
    }
  }

  private async refresh(): Promise<CacheFile> {
    if (!this.configured) {
      throw new ServiceUnavailableException(
        'BLIZZARD_CLIENT_ID e BLIZZARD_CLIENT_SECRET non sono impostati nel file .env',
      );
    }
    const locale = this.config.get<string>('BLIZZARD_LOCALE') ?? 'it_IT';
    const [meta, raw] = await Promise.all([this.metadata(locale), this.allCards(locale)]);
    const file: CacheFile = { savedAt: Date.now(), cards: mapCards(raw, meta) };
    this.memory = file;
    await this.writeFile(file);
    this.log.log(`Carte aggiornate: ${file.cards.length} (da ${raw.length} grezze)`);
    return file;
  }

  private async metadata(locale: string): Promise<Metadata> {
    const [classes, types, rarities] = await Promise.all(
      (['classes', 'types', 'rarities'] as const).map((k) =>
        this.get<MetaEntry[]>(`/hearthstone/metadata/${k}`, { locale }),
      ),
    );
    return { classes, types, rarities };
  }

  private async allCards(locale: string): Promise<BlizzardCard[]> {
    const query = (page: number) => ({ locale, collectible: '1', pageSize: String(PAGE_SIZE), page: String(page) });
    const first = await this.get<CardsPage>('/hearthstone/cards', query(1));
    const rest = await Promise.all(
      Array.from({ length: Math.max(0, first.pageCount - 1) }, (_, i) =>
        this.get<CardsPage>('/hearthstone/cards', query(i + 2)),
      ),
    );
    return [first, ...rest].flatMap((p) => p.cards);
  }

  private get api(): string {
    return `https://${this.config.get('BLIZZARD_REGION') ?? 'eu'}.api.blizzard.com`;
  }

  private async get<T>(path: string, params: Record<string, string>): Promise<T> {
    const url = `${this.api}${path}?${new URLSearchParams(params)}`;
    let res = await fetch(url, { headers: { Authorization: `Bearer ${await this.accessToken()}` } });
    if (res.status === 401) {
      this.token = null;
      res = await fetch(url, { headers: { Authorization: `Bearer ${await this.accessToken(true)}` } });
    }
    if (!res.ok) throw new Error(`Blizzard ${path}: HTTP ${res.status}`);
    return (await res.json()) as T;
  }

  /** OAuth client credentials: il token dura circa 24 ore e viene riusato. */
  private async accessToken(force = false): Promise<string> {
    if (!force && this.token && this.token.expiresAt > Date.now() + 60_000) return this.token.value;
    const id = this.config.get<string>('BLIZZARD_CLIENT_ID') ?? '';
    const secret = this.config.get<string>('BLIZZARD_CLIENT_SECRET') ?? '';
    const region = this.config.get<string>('BLIZZARD_REGION') ?? 'eu';
    const host = region === 'cn' ? 'oauth.battlenet.com.cn' : 'oauth.battle.net';
    const res = await fetch(`https://${host}/token`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${Buffer.from(`${id}:${secret}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });
    if (!res.ok) throw new Error(`Blizzard OAuth: HTTP ${res.status} (controlla client id e secret)`);
    const body = (await res.json()) as { access_token: string; expires_in: number };
    this.token = { value: body.access_token, expiresAt: Date.now() + body.expires_in * 1000 };
    return this.token.value;
  }

  private get cachePath(): string {
    return join(process.cwd(), '.cache', 'cards.json');
  }

  private async readFile(): Promise<CacheFile | null> {
    try {
      return JSON.parse(await readFile(this.cachePath, 'utf8')) as CacheFile;
    } catch {
      return null;
    }
  }

  private async writeFile(file: CacheFile): Promise<void> {
    try {
      await mkdir(join(process.cwd(), '.cache'), { recursive: true });
      await writeFile(this.cachePath, JSON.stringify(file));
    } catch (e) {
      this.log.warn(`Cache su file non scritta: ${(e as Error).message}`);
    }
  }
}
