import { exportDeckCode, importDeckCode } from './deck-code';
import { addCard, newDeck } from './deck-rules';
import { decodeDeck, encodeDeck } from './deckstring';
import type { Card } from './models';

const card = (dbfId: number, over: Partial<Card> = {}): Card => ({
  id: `C${dbfId}`,
  dbfId,
  name: `C${dbfId}`,
  cost: 2,
  cardClass: 'MAGE',
  type: 'MINION',
  rarity: 'COMMON',
  standard: true,
  text: '',
  ...over,
});

describe('deckstring', () => {
  it('codifica e decodifica identico, anche con id grandi e più di 2 copie', () => {
    const src = {
      format: 'standard' as const,
      heroes: [637],
      cards: [
        { dbfId: 5, count: 1 },
        { dbfId: 130_000, count: 2 },
        { dbfId: 77, count: 4 },
      ],
    };
    const out = decodeDeck(encodeDeck(src));
    expect(out.format).toBe('standard');
    expect(out.heroes).toEqual([637]);
    expect([...out.cards].sort((a, b) => a.dbfId - b.dbfId)).toEqual([...src.cards].sort((a, b) => a.dbfId - b.dbfId));
  });

  it('rifiuta codici non validi', () => {
    expect(() => decodeDeck('%%%')).toThrow();
    expect(() => decodeDeck('AAE=')).toThrow();
  });
});

describe('deck code', () => {
  it('esporta e reimporta un mazzo', () => {
    const cards = [card(1), card(2), card(3, { cardClass: 'NEUTRAL', rarity: 'LEGENDARY' })];
    let d = newDeck('MAGE', 'standard', 'T');
    d = addCard(addCard(addCard(addCard(d, cards[0]), cards[0]), cards[1]), cards[2]);
    const { deck, skipped } = importDeckCode(exportDeckCode(d), cards);
    expect(skipped).toBe(0);
    expect(deck.heroClass).toBe('MAGE');
    expect(deck.format).toBe('standard');
    expect(deck.entries.map((e) => [e.card.dbfId, e.count]).sort()).toEqual([
      [1, 2],
      [2, 1],
      [3, 1],
    ]);
  });

  it('conta le carte sconosciute', () => {
    const d = addCard(newDeck('MAGE', 'wild', 'T'), card(1));
    const { skipped } = importDeckCode(exportDeckCode(d), []);
    expect(skipped).toBe(1);
  });
});
