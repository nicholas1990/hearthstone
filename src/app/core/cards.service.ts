import { Injectable, computed, inject, signal } from '@angular/core';

import { readCache, writeCache } from './card-cache';
import type { Card } from './models';
import { BlizzardProvider } from './providers/blizzard.provider';
import type { CardProvider } from './providers/card-provider';
import { HearthstoneJsonProvider } from './providers/hearthstonejson.provider';
import { SettingsStore } from './settings.store';

@Injectable({ providedIn: 'root' })
export class CardsService {
  private readonly settings = inject(SettingsStore);
  private readonly _cards = signal<Card[]>([]);
  private loadedFor = '';

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  /** true se si stanno mostrando le carte in cache perché l'aggiornamento è fallito. */
  readonly stale = signal(false);
  readonly updatedAt = signal<number | null>(null);
  readonly cards = this._cards.asReadonly();
  readonly count = computed(() => this._cards().length);

  private provider(): CardProvider {
    return this.settings.provider() === 'blizzard'
      ? new BlizzardProvider(this.settings.serverUrl())
      : new HearthstoneJsonProvider();
  }

  /** Mostra subito la cache (se c'è) e poi aggiorna dalla rete. `force` ricarica anche se già caricato. */
  async load(force = false): Promise<void> {
    const provider = this.provider();
    const key = `${provider.id}|${this.settings.serverUrl()}`;
    if (this.loading() || (!force && this.loadedFor === key && this._cards().length)) return;
    this.loading.set(true);
    this.error.set(null);
    this.stale.set(false);

    const cached = await readCache(provider.id);
    this._cards.set(cached?.cards ?? []);
    this.updatedAt.set(cached?.savedAt ?? null);

    try {
      const cards = await provider.load();
      this._cards.set(cards);
      this.updatedAt.set(Date.now());
      this.loadedFor = key;
      void writeCache(provider.id, cards);
    } catch (e) {
      const reason = (e as Error).message;
      if (cached) {
        this.stale.set(true);
        this.loadedFor = key;
      } else {
        this.error.set(`Impossibile caricare le carte (${reason}).`);
      }
    } finally {
      this.loading.set(false);
    }
  }
}
