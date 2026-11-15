import type { Card } from './models';

export interface CachedCards {
  cards: Card[];
  savedAt: number;
}

const DB = 'hearthstone';
const STORE = 'cards';

const open = (): Promise<IDBDatabase> =>
  new Promise((resolve, reject) => {
    const req = indexedDB.open(DB, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(STORE);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });

const run = async <T>(mode: IDBTransactionMode, fn: (s: IDBObjectStore) => IDBRequest<T>): Promise<T> => {
  const db = await open();
  return new Promise<T>((resolve, reject) => {
    const req = fn(db.transaction(STORE, mode).objectStore(STORE));
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
};

/** Cache offline delle carte per provider. Ogni errore è ignorato: la cache è solo un'ottimizzazione. */
export const readCache = async (provider: string): Promise<CachedCards | null> => {
  try {
    return ((await run('readonly', (s) => s.get(provider))) as CachedCards | undefined) ?? null;
  } catch {
    return null;
  }
};

export const writeCache = async (provider: string, cards: Card[]): Promise<void> => {
  try {
    await run('readwrite', (s) => s.put({ cards, savedAt: Date.now() } satisfies CachedCards, provider));
  } catch {
    /* ignorato */
  }
};
