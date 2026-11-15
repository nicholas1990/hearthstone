import { dedupe, mapCard } from './hearthstonejson.provider';

describe('hearthstonejson provider', () => {
  it('pulisce il testo dalle etichette html', () => {
    const c = mapCard({
      id: 'A',
      dbfId: 1,
      name: 'X',
      cardClass: 'MAGE',
      type: 'SPELL',
      text: '<b>Grido:</b> $3 danni[x]',
    });
    expect(c.text).toBe('Grido: 3 danni');
    expect(c.cost).toBe(0);
    expect(c.rarity).toBe('FREE');
  });

  it('unisce le ristampe con lo stesso nome', () => {
    const a = mapCard({ id: 'A', dbfId: 1, name: 'Fuoco Fatuo', cost: 0, cardClass: 'NEUTRAL', type: 'MINION' });
    const b = mapCard({ id: 'B', dbfId: 2, name: 'Fuoco Fatuo', cost: 0, cardClass: 'NEUTRAL', type: 'MINION' });
    expect(dedupe([a, b])).toEqual([a]);
  });
});
