import { Injectable, signal } from '@angular/core';

import type { Format } from './models';
import type { ProviderId } from './providers/card-provider';

const KEY = 'hearthstone.settings.v1';

interface Settings {
  provider: ProviderId;
  serverUrl: string;
  format: Format;
}

const DEFAULTS: Settings = { provider: 'hearthstonejson', serverUrl: 'http://localhost:3000', format: 'standard' };

@Injectable({ providedIn: 'root' })
export class SettingsStore {
  readonly provider = signal<ProviderId>(DEFAULTS.provider);
  readonly serverUrl = signal(DEFAULTS.serverUrl);
  /** Formato mostrato quando non c'è un mazzo selezionato. */
  readonly format = signal<Format>(DEFAULTS.format);

  constructor() {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) ?? '{}') as Partial<Settings>;
      if (saved.provider === 'hearthstonejson' || saved.provider === 'blizzard') this.provider.set(saved.provider);
      if (typeof saved.serverUrl === 'string') this.serverUrl.set(saved.serverUrl);
      if (saved.format === 'standard' || saved.format === 'wild') this.format.set(saved.format);
    } catch {
      /* impostazioni di default */
    }
  }

  setProvider(p: ProviderId): void {
    this.provider.set(p);
    this.persist();
  }

  setFormat(f: Format): void {
    this.format.set(f);
    this.persist();
  }

  setServerUrl(url: string): void {
    this.serverUrl.set(url.trim());
    this.persist();
  }

  private persist(): void {
    try {
      localStorage.setItem(
        KEY,
        JSON.stringify({ provider: this.provider(), serverUrl: this.serverUrl(), format: this.format() }),
      );
    } catch {
      /* storage non disponibile */
    }
  }
}
