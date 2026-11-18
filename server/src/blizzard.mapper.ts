import { Card } from './card';

export interface MetaEntry {
  id: number;
  slug: string;
}

export interface BlizzardCard {
  id: number;
  slug?: string;
  classId: number;
  multiClassIds?: number[];
  cardTypeId: number;
  cardSetId?: number;
  rarityId?: number;
  manaCost?: number;
  name: string;
  text?: string;
  attack?: number;
  health?: number;
  durability?: number;
  image?: string;
  cropImage?: string;
}

export interface Metadata {
  classes: MetaEntry[];
  types: MetaEntry[];
  rarities: MetaEntry[];
  sets: MetaEntry[];
  /** Slug dei set giocabili in Standard (dal gruppo "standard" di Blizzard). */
  standardSets: string[];
}

const KEEP_TYPES = new Set(['MINION', 'SPELL', 'WEAPON', 'LOCATION']);

/** "demon-hunter" → "DEMONHUNTER": gli slug di Blizzard diventano i valori usati dall'app. */
export const normalizeSlug = (slug: string | undefined): string => (slug ?? '').replace(/[^a-z]/gi, '').toUpperCase();

const lookup = (entries: MetaEntry[], id: number | undefined): string =>
  normalizeSlug(entries.find((e) => e.id === id)?.slug);

export const cleanText = (text: string | undefined): string =>
  (text ?? '')
    .replace(/<\/?[a-z]+>/gi, '')
    .replace(/\$|#/g, '')
    .replace(/\[x\]/g, '')
    .trim();

/** Restituisce null per le carte che l'app non usa (eroi, potenze eroiche, gettoni...). */
export const mapCard = (c: BlizzardCard, meta: Metadata): Card | null => {
  const type = lookup(meta.types, c.cardTypeId);
  if (!KEEP_TYPES.has(type)) return null;
  const cardClass = lookup(meta.classes, c.classId) || 'NEUTRAL';
  const setSlug = meta.sets.find((s) => s.id === c.cardSetId)?.slug ?? '';
  return {
    // con Blizzard l'id numerico coincide con il dbfId di HearthstoneJSON
    id: String(c.id),
    dbfId: c.id,
    name: c.name,
    cost: c.manaCost ?? 0,
    cardClass,
    type,
    rarity: lookup(meta.rarities, c.rarityId) || 'FREE',
    set: setSlug || undefined,
    standard: meta.standardSets.includes(setSlug),
    image: c.image,
    tile: c.cropImage,
    text: cleanText(c.text),
    attack: c.attack,
    health: c.health,
    durability: c.durability,
  };
};

export const mapCards = (cards: BlizzardCard[], meta: Metadata): Card[] => {
  const at = new Map<string, number>();
  const out: Card[] = [];
  for (const raw of cards) {
    const card = mapCard(raw, meta);
    if (!card) continue;
    // le ristampe (stesso nome, classe, costo e tipo) contano come una sola carta, come nell'app;
    // si tiene la versione Standard
    const key = `${card.name}|${card.cardClass}|${card.cost}|${card.type}`;
    const i = at.get(key);
    if (i === undefined) {
      at.set(key, out.length);
      out.push(card);
    } else if (card.standard && !out[i].standard) {
      out[i] = card;
    }
  }
  return out;
};
