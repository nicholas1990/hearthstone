import type { Card, HeroClass } from '../models';

import type { CardProvider } from './card-provider';

const URL = 'https://api.hearthstonejson.com/v1/latest/itIT/cards.collectible.json';
const KEEP_TYPES = new Set(['MINION', 'SPELL', 'WEAPON', 'LOCATION']);

export interface RawCard {
  id: string;
  dbfId: number;
  name: string;
  cost?: number;
  cardClass: string;
  type: string;
  rarity?: string;
  text?: string;
  attack?: number;
  health?: number;
  durability?: number;
}

export const mapCard = (raw: RawCard): Card => ({
  id: raw.id,
  dbfId: raw.dbfId,
  name: raw.name,
  cost: raw.cost ?? 0,
  cardClass: raw.cardClass as HeroClass | 'NEUTRAL',
  type: raw.type,
  rarity: (raw.rarity ?? 'FREE') as Card['rarity'],
  text: (raw.text ?? '')
    .replace(/<\/?[a-z]+>/gi, '')
    .replace(/\$|#/g, '')
    .replace(/\[x\]/g, ''),
  attack: raw.attack,
  health: raw.health,
  durability: raw.durability,
});

/** Le ristampe (stesso nome, classe, costo e tipo in set diversi) contano come una sola carta. */
export const dedupe = (cards: Card[]): Card[] => {
  const seen = new Map<string, Card>();
  for (const c of cards) {
    const key = `${c.name}|${c.cardClass}|${c.cost}|${c.type}`;
    if (!seen.has(key)) seen.set(key, c);
  }
  return [...seen.values()];
};

export class HearthstoneJsonProvider implements CardProvider {
  readonly id = 'hearthstonejson' as const;
  readonly label = 'HearthstoneJSON';

  async load(): Promise<Card[]> {
    const res = await fetch(URL);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const raw = (await res.json()) as RawCard[];
    return dedupe(raw.filter((c) => KEEP_TYPES.has(c.type)).map(mapCard));
  }
}
