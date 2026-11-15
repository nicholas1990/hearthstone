import type { Card, Deck, HeroClass } from './models';
import { DECK_SIZE } from './models';

export type AddResult = 'ok' | 'full' | 'max-copies' | 'wrong-class';

export const deckCount = (deck: Deck): number => deck.entries.reduce((n, e) => n + e.count, 0);

export const maxCopies = (card: Card): number => (card.rarity === 'LEGENDARY' ? 1 : 2);

export const canAdd = (deck: Deck, card: Card): AddResult => {
  if (card.cardClass !== 'NEUTRAL' && card.cardClass !== deck.heroClass) return 'wrong-class';
  if (deckCount(deck) >= DECK_SIZE) return 'full';
  const entry = deck.entries.find((e) => e.card.id === card.id);
  if (entry && entry.count >= maxCopies(card)) return 'max-copies';
  return 'ok';
};

export const addCard = (deck: Deck, card: Card): Deck => {
  if (canAdd(deck, card) !== 'ok') return deck;
  const found = deck.entries.some((e) => e.card.id === card.id);
  const entries = found
    ? deck.entries.map((e) => (e.card.id === card.id ? { ...e, count: e.count + 1 } : e))
    : [...deck.entries, { card, count: 1 }];
  return { ...deck, entries: sortEntries(entries) };
};

export const removeCard = (deck: Deck, cardId: string): Deck => ({
  ...deck,
  entries: deck.entries
    .map((e) => (e.card.id === cardId ? { ...e, count: e.count - 1 } : e))
    .filter((e) => e.count > 0),
});

export const sortEntries = <T extends { card: Card }>(entries: T[]): T[] =>
  [...entries].sort((a, b) => a.card.cost - b.card.cost || a.card.name.localeCompare(b.card.name));

/** Quante carte per costo di mana (7 = 7 o più). */
export const manaCurve = (deck: Deck): number[] => {
  const curve = new Array<number>(8).fill(0);
  for (const e of deck.entries) curve[Math.min(e.card.cost, 7)] += e.count;
  return curve;
};

export const newDeck = (heroClass: HeroClass): Deck => ({ heroClass, entries: [] });
