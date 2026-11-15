import { Injectable, computed, signal } from '@angular/core';

import type { AddResult } from './deck-rules';
import { addCard, canAdd, deckCount, manaCurve, newDeck, removeCard } from './deck-rules';
import type { Card, Deck, HeroClass } from './models';
import { DECK_SIZE } from './models';

const KEY = 'hearthstone.deck.v1';

@Injectable({ providedIn: 'root' })
export class DeckStore {
  readonly deck = signal<Deck | null>(this.restore());
  readonly count = computed(() => (this.deck() ? deckCount(this.deck()!) : 0));
  readonly curve = computed(() => (this.deck() ? manaCurve(this.deck()!) : []));
  readonly complete = computed(() => this.count() === DECK_SIZE);

  start(heroClass: HeroClass): void {
    this.set(newDeck(heroClass));
  }

  clear(): void {
    this.set(null);
  }

  add(card: Card): AddResult {
    const deck = this.deck();
    if (!deck) return 'wrong-class';
    const result = canAdd(deck, card);
    if (result === 'ok') this.set(addCard(deck, card));
    return result;
  }

  remove(cardId: string): void {
    const deck = this.deck();
    if (deck) this.set(removeCard(deck, cardId));
  }

  countOf(cardId: string): number {
    return this.deck()?.entries.find((e) => e.card.id === cardId)?.count ?? 0;
  }

  private set(deck: Deck | null): void {
    this.deck.set(deck);
    try {
      if (deck) localStorage.setItem(KEY, JSON.stringify(deck));
      else localStorage.removeItem(KEY);
    } catch {
      /* storage non disponibile: il mazzo resta solo in memoria */
    }
  }

  private restore(): Deck | null {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? (JSON.parse(raw) as Deck) : null;
    } catch {
      return null;
    }
  }
}
