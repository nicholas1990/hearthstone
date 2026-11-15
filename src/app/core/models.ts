export const HERO_CLASSES = [
  'DRUID',
  'HUNTER',
  'MAGE',
  'PALADIN',
  'PRIEST',
  'ROGUE',
  'SHAMAN',
  'WARLOCK',
  'WARRIOR',
  'DEMONHUNTER',
  'DEATHKNIGHT',
] as const;

export type HeroClass = (typeof HERO_CLASSES)[number];

export const CLASS_LABELS: Record<HeroClass | 'NEUTRAL', string> = {
  DRUID: 'Druido',
  HUNTER: 'Cacciatore',
  MAGE: 'Mago',
  PALADIN: 'Paladino',
  PRIEST: 'Sacerdote',
  ROGUE: 'Ladro',
  SHAMAN: 'Sciamano',
  WARLOCK: 'Stregone',
  WARRIOR: 'Guerriero',
  DEMONHUNTER: 'Cacciatore di Demoni',
  DEATHKNIGHT: 'Cavaliere della Morte',
  NEUTRAL: 'Neutrali',
};

export const CLASS_COLORS: Record<HeroClass | 'NEUTRAL', string> = {
  DRUID: '#8a5a2b',
  HUNTER: '#2f8f46',
  MAGE: '#3f8ad8',
  PALADIN: '#d9b43c',
  PRIEST: '#d8d8e0',
  ROGUE: '#7a7a8c',
  SHAMAN: '#2a62c9',
  WARLOCK: '#8a4bb8',
  WARRIOR: '#b5302a',
  DEMONHUNTER: '#2f9e8f',
  DEATHKNIGHT: '#5fa3c4',
  NEUTRAL: '#9a8f7a',
};

export type Rarity = 'FREE' | 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';

export interface Card {
  id: string;
  dbfId: number;
  name: string;
  cost: number;
  cardClass: HeroClass | 'NEUTRAL';
  type: string;
  rarity: Rarity;
  text: string;
  attack?: number;
  health?: number;
  durability?: number;
}

export interface DeckEntry {
  card: Card;
  count: number;
}

export interface Deck {
  heroClass: HeroClass;
  entries: DeckEntry[];
}

export const DECK_SIZE = 30;

export const cardImage = (id: string): string => `https://art.hearthstonejson.com/v1/render/latest/itIT/256x/${id}.png`;

export const cardTile = (id: string): string => `https://art.hearthstonejson.com/v1/tiles/${id}.webp`;
