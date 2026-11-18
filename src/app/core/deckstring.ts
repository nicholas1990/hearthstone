import type { Format } from './models';

/**
 * Codice mazzo di Hearthstone (deckstring): base64 di un flusso di interi a lunghezza variabile.
 * 0x00 | versione (1) | formato (1 wild, 2 standard) | eroi | carte x1 | carte x2 | carte xN
 */
export interface DecodedDeck {
  format: Format;
  heroes: number[];
  cards: { dbfId: number; count: number }[];
}

const FORMAT_CODE: Record<Format, number> = { wild: 1, standard: 2 };

const writeVarint = (out: number[], value: number): void => {
  let v = value;
  while (v > 0x7f) {
    out.push((v & 0x7f) | 0x80);
    v = Math.floor(v / 128);
  }
  out.push(v);
};

const toBase64 = (bytes: number[]): string => btoa(String.fromCharCode(...bytes));

export const encodeDeck = (deck: DecodedDeck): string => {
  const out: number[] = [0, 1, FORMAT_CODE[deck.format], deck.heroes.length];
  deck.heroes.forEach((h) => writeVarint(out, h));
  const byCount = (n: number) =>
    deck.cards.filter((c) => (n === 0 ? c.count > 2 : c.count === n)).sort((a, b) => a.dbfId - b.dbfId);
  for (const n of [1, 2]) {
    const group = byCount(n);
    writeVarint(out, group.length);
    group.forEach((c) => writeVarint(out, c.dbfId));
  }
  const many = byCount(0);
  writeVarint(out, many.length);
  many.forEach((c) => {
    writeVarint(out, c.dbfId);
    writeVarint(out, c.count);
  });
  return toBase64(out);
};

export const decodeDeck = (code: string): DecodedDeck => {
  let bytes: Uint8Array;
  try {
    bytes = Uint8Array.from(atob(code.trim()), (ch) => ch.charCodeAt(0));
  } catch {
    throw new Error('Il codice non è valido.');
  }
  let pos = 0;
  const next = (): number => {
    if (pos >= bytes.length) throw new Error('Il codice è incompleto.');
    return bytes[pos++];
  };
  const varint = (): number => {
    let result = 0;
    let shift = 0;
    for (;;) {
      const b = next();
      result += (b & 0x7f) * 2 ** shift;
      if (!(b & 0x80)) return result;
      shift += 7;
      if (shift > 35) throw new Error('Il codice non è valido.');
    }
  };

  if (next() !== 0) throw new Error('Il codice non è valido.');
  if (next() !== 1) throw new Error('Versione del codice non supportata.');
  const f = next();
  if (f !== 1 && f !== 2) throw new Error('Formato del mazzo non supportato (solo Standard e Wild).');
  const heroes = Array.from({ length: varint() }, varint);
  const cards: DecodedDeck['cards'] = [];
  for (const count of [1, 2]) {
    const n = varint();
    for (let i = 0; i < n; i++) cards.push({ dbfId: varint(), count });
  }
  const many = varint();
  for (let i = 0; i < many; i++) {
    const dbfId = varint();
    cards.push({ dbfId, count: varint() });
  }
  return { format: f === 2 ? 'standard' : 'wild', heroes, cards };
};
