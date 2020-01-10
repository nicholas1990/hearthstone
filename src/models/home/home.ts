export interface Authorization {
  code: string;
}

export interface Token{
  access_token: string;
  token_type: string;
  expires_in: number;
}


export interface RootObject {
  cards: Card[];
  cardCount: number;
  pageCount: number;
  page: number;
}
export interface Name {
  de_DE: string;
  en_US: string;
  es_ES: string;
  es_MX: string;
  fr_FR: string;
  it_IT: string;
  ja_JP: string;
  ko_KR: string;
  pl_PL: string;
  pt_BR: string;
  ru_RU: string;
  th_TH: string;
  zh_CN: string;
  zh_TW: string;
}

export interface Text {
  de_DE: string;
  en_US: string;
  es_ES: string;
  es_MX: string;
  fr_FR: string;
  it_IT: string;
  ja_JP: string;
  ko_KR: string;
  pl_PL: string;
  pt_BR: string;
  ru_RU: string;
  th_TH: string;
  zh_CN: string;
  zh_TW: string;
}

export interface Image {
  de_DE: string;
  en_US: string;
  es_ES: string;
  es_MX: string;
  fr_FR: string;
  it_IT: string;
  ja_JP: string;
  ko_KR: string;
  pl_PL: string;
  pt_BR: string;
  ru_RU: string;
  th_TH: string;
  zh_CN: string;
  zh_TW: string;
}

export interface ImageGold {
  en_US: string;
}

export interface FlavorText {
  de_DE: string;
  en_US: string;
  es_ES: string;
  es_MX: string;
  fr_FR: string;
  it_IT: string;
  ja_JP: string;
  ko_KR: string;
  pl_PL: string;
  pt_BR: string;
  ru_RU: string;
  th_TH: string;
  zh_CN: string;
  zh_TW: string;
}

export interface Card {
  id: number;
  collectible: number;
  slug: string;
  classId: number;
  multiClassIds: any[];
  cardTypeId: number;
  cardSetId: number;
  rarityId: number;
  artistName: string;
  manaCost: number;
  name: Name;
  text: Text;
  image: Image;
  imageGold: ImageGold;
  flavorText: FlavorText;
  cropImage: string;
  health?: number;
  parentId?: number;
  childIds: number[];
  keywordIds: number[];
  attack?: number;
  minionTypeId?: number;
  armor?: number;
}
