/** Stesso formato di src/app/core/models.ts dell'app. */
export interface Card {
  id: string;
  dbfId: number;
  name: string;
  cost: number;
  cardClass: string;
  type: string;
  rarity: string;
  image?: string;
  tile?: string;
  text: string;
  attack?: number;
  health?: number;
  durability?: number;
}
