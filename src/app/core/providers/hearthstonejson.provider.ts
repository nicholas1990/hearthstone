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
  set?: string;
}

/**
 * Set giocabili in Standard (verificati il 18/11/2026 contro l'API Blizzard: 1322 carte su 1322).
 * HearthstoneJSON non dice quali set sono in Standard, quindi la lista va aggiornata a ogni rotazione.
 * Con il provider Blizzard il dato arriva direttamente dall'API.
 */
export const STANDARD_SETS: ReadonlySet<string> = new Set([
  'CORE',
  'EVENT',
  'BE',
  'CATACLYSM',
  'ESCAPEFROM_VIOLET_HOLD',
  'THE_LOST_CITY',
  'EMERALD_DREAM',
  'TIME_TRAVEL',
]);

export const mapCard = (raw: RawCard): Card => ({
  id: raw.id,
  dbfId: raw.dbfId,
  name: raw.name,
  cost: raw.cost ?? 0,
  cardClass: raw.cardClass as HeroClass | 'NEUTRAL',
  type: raw.type,
  rarity: (raw.rarity ?? 'FREE') as Card['rarity'],
  set: raw.set,
  standard: STANDARD_SETS.has(raw.set ?? ''),
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
  const at = new Map<string, number>();
  const out: Card[] = [];
  for (const c of cards) {
    const key = `${c.name}|${c.cardClass}|${c.cost}|${c.type}`;
    const i = at.get(key);
    if (i === undefined) {
      at.set(key, out.length);
      out.push(c);
    } else if (c.standard && !out[i].standard) {
      out[i] = c; // di una ristampa si tiene la versione Standard
    }
  }
  return out;
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
