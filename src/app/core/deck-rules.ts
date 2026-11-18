import type { Card, Deck, Format, HeroClass } from './models';
import { DECK_SIZE } from './models';

export type AddResult = 'ok' | 'full' | 'max-copies' | 'wrong-class' | 'wrong-format';

export const deckCount = (deck: Deck): number => deck.entries.reduce((n, e) => n + e.count, 0);

export const maxCopies = (card: Card): number => (card.rarity === 'LEGENDARY' ? 1 : 2);

/** Un mazzo Standard accetta solo carte Standard; un mazzo Wild le accetta tutte. */
export const allowedInFormat = (card: Card, format: Format): boolean => format === 'wild' || card.standard;

export const canAdd = (deck: Deck, card: Card): AddResult => {
  if (card.cardClass !== 'NEUTRAL' && card.cardClass !== deck.heroClass) return 'wrong-class';
  if (!allowedInFormat(card, deck.format)) return 'wrong-format';
  if (deckCount(deck) >= DECK_SIZE) return 'full';
  const entry = deck.entries.find((e) => e.card.dbfId === card.dbfId);
  if (entry && entry.count >= maxCopies(card)) return 'max-copies';
  return 'ok';
};

export const addCard = (deck: Deck, card: Card): Deck => {
  if (canAdd(deck, card) !== 'ok') return deck;
  const found = deck.entries.some((e) => e.card.dbfId === card.dbfId);
  const entries = found
    ? deck.entries.map((e) => (e.card.dbfId === card.dbfId ? { ...e, count: e.count + 1 } : e))
    : [...deck.entries, { card, count: 1 }];
  return { ...deck, entries: sortEntries(entries), updatedAt: Date.now() };
};

export const removeCard = (deck: Deck, dbfId: number): Deck => ({
  ...deck,
  entries: deck.entries
    .map((e) => (e.card.dbfId === dbfId ? { ...e, count: e.count - 1 } : e))
    .filter((e) => e.count > 0),
  updatedAt: Date.now(),
});

export const sortEntries = <T extends { card: Card }>(entries: T[]): T[] =>
  [...entries].sort((a, b) => a.card.cost - b.card.cost || a.card.name.localeCompare(b.card.name));

/** Quante carte per costo di mana (7 = 7 o più). */
export const manaCurve = (deck: Deck): number[] => {
  const curve = new Array<number>(8).fill(0);
  for (const e of deck.entries) curve[Math.min(e.card.cost, 7)] += e.count;
  return curve;
};

export const makeId = (): string => `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;

export const newDeck = (heroClass: HeroClass, format: Format, name: string): Deck => ({
  id: makeId(),
  name,
  heroClass,
  format,
  entries: [],
  updatedAt: Date.now(),
});

export const duplicateDeck = (deck: Deck, name: string): Deck => ({
  ...deck,
  id: makeId(),
  name,
  updatedAt: Date.now(),
});

/** Carte del mazzo non ammesse nel suo formato (es. dopo la rotazione di Standard). */
export const illegalCards = (deck: Deck): number =>
  deck.entries.filter((e) => !allowedInFormat(e.card, deck.format)).reduce((n, e) => n + e.count, 0);
