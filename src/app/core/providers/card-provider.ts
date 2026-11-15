import type { Card } from '../models';

export type ProviderId = 'hearthstonejson' | 'blizzard';

export interface CardProvider {
  readonly id: ProviderId;
  readonly label: string;
  load(): Promise<Card[]>;
}

export const PROVIDER_LABELS: Record<ProviderId, string> = {
  hearthstonejson: 'HearthstoneJSON (community)',
  blizzard: 'API Blizzard (server locale)',
};
