import { BlizzardCard, cleanText, mapCards, Metadata, normalizeSlug } from './blizzard.mapper';

const meta: Metadata = {
  classes: [
    { id: 4, slug: 'mage' },
    { id: 14, slug: 'demon-hunter' },
    { id: 12, slug: 'neutral' },
  ],
  types: [
    { id: 4, slug: 'minion' },
    { id: 5, slug: 'spell' },
    { id: 3, slug: 'hero' },
  ],
  rarities: [
    { id: 5, slug: 'legendary' },
    { id: 2, slug: 'free' },
  ],
  sets: [
    { id: 10, slug: 'core' },
    { id: 11, slug: 'old-set' },
  ],
  standardSets: ['core'],
};

const card = (over: Partial<BlizzardCard>): BlizzardCard => ({
  id: 1,
  classId: 4,
  cardTypeId: 4,
  rarityId: 5,
  manaCost: 3,
  name: 'Carta',
  ...over,
});

describe('blizzard mapper', () => {
  it('normalizza gli slug', () => {
    expect(normalizeSlug('demon-hunter')).toBe('DEMONHUNTER');
    expect(normalizeSlug(undefined)).toBe('');
  });

  it('pulisce il testo', () => {
    expect(cleanText('<b>Grido:</b> $2 danni[x]')).toBe('Grido: 2 danni');
  });

  it("converte nel formato dell'app e usa l'id numerico come dbfId", () => {
    const [c] = mapCards([card({ id: 2571, image: 'http://i', cropImage: 'http://t', attack: 3, health: 4 })], meta);
    expect(c).toMatchObject({
      id: '2571',
      dbfId: 2571,
      cardClass: 'MAGE',
      type: 'MINION',
      rarity: 'LEGENDARY',
      cost: 3,
      image: 'http://i',
      tile: 'http://t',
      attack: 3,
    });
  });

  it('scarta i tipi non usati e unisce le ristampe', () => {
    const out = mapCards(
      [
        card({ id: 1, cardTypeId: 3 }),
        card({ id: 2, name: 'A' }),
        card({ id: 3, name: 'A' }),
        card({ id: 4, classId: 14, name: 'B' }),
      ],
      meta,
    );
    expect(out.map((c) => c.dbfId)).toEqual([2, 4]);
    expect(out[1].cardClass).toBe('DEMONHUNTER');
  });

  it('segna Standard le carte dei set in rotazione e tiene la versione Standard delle ristampe', () => {
    const out = mapCards(
      [
        card({ id: 1, name: 'R', cardSetId: 11 }),
        card({ id: 2, name: 'R', cardSetId: 10 }),
        card({ id: 3, name: 'S', cardSetId: 11 }),
      ],
      meta,
    );
    expect(out.map((c) => [c.dbfId, c.standard, c.set])).toEqual([
      [2, true, 'core'],
      [3, false, 'old-set'],
    ]);
  });

  it('usa NEUTRAL e FREE quando mancano i dati', () => {
    const [c] = mapCards([card({ classId: 99, rarityId: undefined, manaCost: undefined })], meta);
    expect(c).toMatchObject({ cardClass: 'NEUTRAL', rarity: 'FREE', cost: 0 });
  });
});
