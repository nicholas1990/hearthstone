import type { Card } from '../models';

import type { CardProvider } from './card-provider';

/** Parla con il server locale (cartella server/), che restituisce già carte nel nostro formato. */
export class BlizzardProvider implements CardProvider {
  readonly id = 'blizzard' as const;
  readonly label = 'API Blizzard';

  constructor(private readonly serverUrl: string) {}

  async load(): Promise<Card[]> {
    const base = this.serverUrl.replace(/\/+$/, '');
    if (!base) throw new Error('indirizzo del server non impostato');
    const res = await fetch(`${base}/cards`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return (await res.json()) as Card[];
  }
}
