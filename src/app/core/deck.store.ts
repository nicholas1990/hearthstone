import { Injectable, computed, signal } from '@angular/core';

import type { AddResult } from './deck-rules';
import { addCard, canAdd, deckCount, duplicateDeck, manaCurve, newDeck, removeCard } from './deck-rules';
import type { Card, Deck, Format, HeroClass } from './models';
import { DECK_SIZE, FORMAT_LABELS, CLASS_LABELS } from './models';

const KEY = 'hearthstone.decks.v2';
const KEY_V1 = 'hearthstone.deck.v1';

interface Saved {
  decks: Deck[];
  activeId: string | null;
}

@Injectable({ providedIn: 'root' })
export class DeckStore {
  private readonly initial = this.restore();
  readonly decks = signal<Deck[]>(this.initial.decks);
  readonly activeId = signal<string | null>(this.initial.activeId);

  /** Il mazzo selezionato (null se non ce ne sono). */
  readonly deck = computed(() => this.decks().find((d) => d.id === this.activeId()) ?? null);
  readonly count = computed(() => (this.deck() ? deckCount(this.deck()!) : 0));
  readonly curve = computed(() => (this.deck() ? manaCurve(this.deck()!) : []));
  readonly complete = computed(() => this.count() === DECK_SIZE);

  create(heroClass: HeroClass, format: Format, name?: string): Deck {
    const deck = newDeck(heroClass, format, name?.trim() || this.defaultName(heroClass, format));
    this.save([...this.decks(), deck], deck.id);
    return deck;
  }

  select(id: string): void {
    if (this.decks().some((d) => d.id === id)) this.save(this.decks(), id);
  }

  rename(id: string, name: string): void {
    const clean = name.trim();
    if (clean)
      this.save(
        this.decks().map((d) => (d.id === id ? { ...d, name: clean } : d)),
        this.activeId(),
      );
  }

  duplicate(id: string): void {
    const src = this.decks().find((d) => d.id === id);
    if (!src) return;
    const copy = duplicateDeck(src, `${src.name} (copia)`);
    this.save([...this.decks(), copy], copy.id);
  }

  delete(id: string): void {
    const rest = this.decks().filter((d) => d.id !== id);
    const active = this.activeId() === id ? (rest[rest.length - 1]?.id ?? null) : this.activeId();
    this.save(rest, active);
  }

  add(card: Card): AddResult {
    const deck = this.deck();
    if (!deck) return 'wrong-class';
    const result = canAdd(deck, card);
    if (result === 'ok') this.update(addCard(deck, card));
    return result;
  }

  remove(dbfId: number): void {
    const deck = this.deck();
    if (deck) this.update(removeCard(deck, dbfId));
  }

  countOf(dbfId: number): number {
    return this.deck()?.entries.find((e) => e.card.dbfId === dbfId)?.count ?? 0;
  }

  private defaultName(heroClass: HeroClass, format: Format): string {
    const base = `${CLASS_LABELS[heroClass]} ${FORMAT_LABELS[format]}`;
    const taken = this.decks().filter((d) => d.name === base || d.name.startsWith(`${base} #`)).length;
    return taken ? `${base} #${taken + 1}` : base;
  }

  private update(deck: Deck): void {
    this.save(
      this.decks().map((d) => (d.id === deck.id ? deck : d)),
      this.activeId(),
    );
  }

  private save(decks: Deck[], activeId: string | null): void {
    this.decks.set(decks);
    this.activeId.set(activeId);
    try {
      localStorage.setItem(KEY, JSON.stringify({ decks, activeId } satisfies Saved));
    } catch {
      /* storage non disponibile: i mazzi restano solo in memoria */
    }
  }

  private restore(): Saved {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const saved = JSON.parse(raw) as Saved;
        return { decks: saved.decks ?? [], activeId: saved.activeId ?? saved.decks?.[0]?.id ?? null };
      }
      // migrazione dal mazzo unico della versione precedente (senza filtro di formato: era Wild)
      const old = localStorage.getItem(KEY_V1);
      if (old) {
        const v1 = JSON.parse(old) as { heroClass: HeroClass; entries: Deck['entries'] };
        const deck: Deck = {
          ...newDeck(v1.heroClass, 'wild', `${CLASS_LABELS[v1.heroClass]} Wild`),
          entries: v1.entries.map((e) => ({ ...e, card: { ...e.card, standard: e.card.standard ?? false } })),
        };
        return { decks: [deck], activeId: deck.id };
      }
    } catch {
      /* si riparte senza mazzi */
    }
    return { decks: [], activeId: null };
  }
}
