import { addCard, canAdd, makeId, newDeck } from './deck-rules';
import { decodeDeck, encodeDeck } from './deckstring';
import type { Card, Deck, HeroClass } from './models';
import { CLASS_LABELS, FORMAT_LABELS } from './models';

/** dbfId degli eroi base: il codice mazzo ne vuole uno. */
export const HERO_DBF: Record<HeroClass, number> = {
  DRUID: 274,
  HUNTER: 31,
  MAGE: 637,
  PALADIN: 671,
  PRIEST: 813,
  ROGUE: 930,
  SHAMAN: 1066,
  WARLOCK: 893,
  WARRIOR: 7,
  DEMONHUNTER: 56550,
  DEATHKNIGHT: 78065,
};

export const exportDeckCode = (deck: Deck): string =>
  encodeDeck({
    format: deck.format,
    heroes: [HERO_DBF[deck.heroClass] ?? 637],
    cards: deck.entries.map((e) => ({ dbfId: e.card.dbfId, count: e.count })),
  });

export interface ImportResult {
  deck: Deck;
  /** carte del codice che non esistono nell'elenco caricato o che il mazzo non accetta */
  skipped: number;
}

export const importDeckCode = (code: string, cards: Card[]): ImportResult => {
  const decoded = decodeDeck(code);
  const byDbf = new Map(cards.map((c) => [c.dbfId, c]));
  const known = decoded.cards.map((c) => ({ card: byDbf.get(c.dbfId), count: c.count }));
  const heroClass =
    (known.find((k) => k.card && k.card.cardClass !== 'NEUTRAL')?.card?.cardClass as HeroClass | undefined) ??
    (Object.entries(HERO_DBF).find(([, id]) => decoded.heroes.includes(id))?.[0] as HeroClass | undefined);
  if (!heroClass) throw new Error('Non riesco a capire la classe del mazzo.');

  let deck = newDeck(
    heroClass,
    decoded.format,
    `${CLASS_LABELS[heroClass]} ${FORMAT_LABELS[decoded.format]} (importato)`,
  );
  deck = { ...deck, id: makeId() };
  let skipped = 0;
  for (const { card, count } of known) {
    for (let i = 0; i < count; i++) {
      if (card && canAdd(deck, card) === 'ok') deck = addCard(deck, card);
      else skipped++;
    }
  }
  return { deck, skipped };
};
