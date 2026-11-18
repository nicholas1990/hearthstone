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

  it('segna Standard i set in rotazione e tiene la versione Standard delle ristampe', () => {
    const old = mapCard({ id: 'A', dbfId: 1, name: 'R', cost: 1, cardClass: 'NEUTRAL', type: 'MINION', set: 'LEGACY' });
    const cur = mapCard({ id: 'B', dbfId: 2, name: 'R', cost: 1, cardClass: 'NEUTRAL', type: 'MINION', set: 'CORE' });
    expect(old.standard).toBe(false);
    expect(cur.standard).toBe(true);
    expect(dedupe([old, cur])).toEqual([cur]);
  });
});
