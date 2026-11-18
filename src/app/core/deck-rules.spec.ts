import { addCard, canAdd, deckCount, duplicateDeck, illegalCards, manaCurve, newDeck, removeCard } from './deck-rules';
import type { Card } from './models';

const card = (id: string, over: Partial<Card> = {}): Card => ({
  id,
  dbfId: id.split('').reduce((n, ch) => n * 31 + ch.charCodeAt(0), 7),
  name: id,
  cost: 2,
  cardClass: 'MAGE',
  type: 'MINION',
  rarity: 'COMMON',
  standard: true,
  text: '',
  ...over,
});

describe('deck rules', () => {
  it('permette al massimo 2 copie', () => {
    let d = newDeck('MAGE', 'wild', 'T');
    d = addCard(addCard(d, card('a')), card('a'));
    expect(deckCount(d)).toBe(2);
    expect(canAdd(d, card('a'))).toBe('max-copies');
  });

  it('permette 1 sola leggendaria', () => {
    const l = card('l', { rarity: 'LEGENDARY' });
    const d = addCard(newDeck('MAGE', 'wild', 'T'), l);
    expect(canAdd(d, l)).toBe('max-copies');
  });

  it("rifiuta carte di un'altra classe ma accetta le neutrali", () => {
    const d = newDeck('MAGE', 'wild', 'T');
    expect(canAdd(d, card('x', { cardClass: 'WARRIOR' }))).toBe('wrong-class');
    expect(canAdd(d, card('n', { cardClass: 'NEUTRAL' }))).toBe('ok');
  });

  it('si ferma a 30 carte', () => {
    let d = newDeck('MAGE', 'wild', 'T');
    for (let i = 0; i < 15; i++) d = addCard(addCard(d, card(`c${i}`)), card(`c${i}`));
    expect(deckCount(d)).toBe(30);
    expect(canAdd(d, card('extra'))).toBe('full');
  });

  it('rimuove una copia alla volta e calcola la curva', () => {
    let d = addCard(addCard(newDeck('MAGE', 'wild', 'T'), card('a', { cost: 9 })), card('a', { cost: 9 }));
    expect(manaCurve(d)[7]).toBe(2);
    d = removeCard(d, card('a').dbfId);
    expect(deckCount(d)).toBe(1);
    d = removeCard(d, card('a').dbfId);
    expect(d.entries).toHaveLength(0);
  });

  it('un mazzo Standard rifiuta le carte Wild, uno Wild le accetta', () => {
    const wildCard = card('w', { standard: false });
    expect(canAdd(newDeck('MAGE', 'standard', 'S'), wildCard)).toBe('wrong-format');
    expect(canAdd(newDeck('MAGE', 'wild', 'W'), wildCard)).toBe('ok');
  });

  it('segnala le carte non più ammesse e duplica con un nuovo id', () => {
    let d = addCard(newDeck('MAGE', 'wild', 'W'), card('w', { standard: false }));
    d = { ...d, format: 'standard' };
    expect(illegalCards(d)).toBe(1);
    const copy = duplicateDeck(d, 'Copia');
    expect(copy.id).not.toBe(d.id);
    expect(copy.entries).toEqual(d.entries);
  });
});
