import { Injectable, computed, signal } from '@angular/core';

import type { Card, HeroClass } from './models';

const URL = 'https://api.hearthstonejson.com/v1/latest/itIT/cards.collectible.json';
const KEEP_TYPES = new Set(['MINION', 'SPELL', 'WEAPON', 'LOCATION']);

interface RawCard {
  id: string;
  dbfId: number;
  name: string;
  cost?: number;
  cardClass: string;
  type: string;
  rarity?: string;
  text?: string;
  attack?: number;
  health?: number;
  durability?: number;
}

export const mapCard = (raw: RawCard): Card => ({
  id: raw.id,
  dbfId: raw.dbfId,
  name: raw.name,
  cost: raw.cost ?? 0,
  cardClass: raw.cardClass as HeroClass | 'NEUTRAL',
  type: raw.type,
  rarity: (raw.rarity ?? 'FREE') as Card['rarity'],
  text: (raw.text ?? '')
    .replace(/<\/?[a-z]+>/gi, '')
    .replace(/\$|#/g, '')
    .replace(/\[x\]/g, ''),
  attack: raw.attack,
  health: raw.health,
  durability: raw.durability,
});

/** Le ristampe (stesso nome, classe, costo e tipo in set diversi) contano come una sola carta. */
export const dedupe = (cards: Card[]): Card[] => {
  const seen = new Map<string, Card>();
  for (const c of cards) {
    const key = `${c.name}|${c.cardClass}|${c.cost}|${c.type}`;
    if (!seen.has(key)) seen.set(key, c);
  }
  return [...seen.values()];
};

@Injectable({ providedIn: 'root' })
export class CardsService {
  private readonly _cards = signal<Card[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly cards = this._cards.asReadonly();
  readonly count = computed(() => this._cards().length);

  async load(): Promise<void> {
    if (this._cards().length || this.loading()) return;
    this.loading.set(true);
    this.error.set(null);
    try {
      const res = await fetch(URL);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const raw = (await res.json()) as RawCard[];
      this._cards.set(dedupe(raw.filter((c) => KEEP_TYPES.has(c.type)).map(mapCard)));
    } catch (e) {
      this.error.set(`Impossibile caricare le carte (${(e as Error).message}).`);
    } finally {
      this.loading.set(false);
    }
  }
}
