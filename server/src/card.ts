/** Stesso formato di src/app/core/models.ts dell'app. */
export interface Card {
  id: string;
  dbfId: number;
  name: string;
  cost: number;
  cardClass: string;
  type: string;
  rarity: string;
  set?: string;
  standard: boolean;
  image?: string;
  tile?: string;
  text: string;
  attack?: number;
  health?: number;
  durability?: number;
}
