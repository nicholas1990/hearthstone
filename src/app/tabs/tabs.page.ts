import { Component, inject } from '@angular/core';
import { IonBadge, IonIcon, IonLabel, IonTabBar, IonTabButton, IonTabs } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { albumsOutline, layersOutline, settingsOutline } from 'ionicons/icons';

import { DeckStore } from '../core/deck.store';

@Component({
  selector: 'app-tabs',
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonBadge],
  template: `
    <ion-tabs>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="cards">
          <ion-icon name="albums-outline" />
          <ion-label>Carte</ion-label>
        </ion-tab-button>
        <ion-tab-button tab="deck">
          <ion-icon name="layers-outline" />
          <ion-label>Mazzo</ion-label>
          @if (deck.deck()) {
            <ion-badge [color]="deck.complete() ? 'success' : 'warning'">{{ deck.count() }}</ion-badge>
          }
        </ion-tab-button>
        <ion-tab-button tab="settings">
          <ion-icon name="settings-outline" />
          <ion-label>Impostazioni</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  `,
  styles: `
    ion-badge {
      position: absolute;
      top: 2px;
      inset-inline-start: calc(50% + 12px);
      min-width: 20px;
      padding: 2px 5px;
      font-size: 11px;
      line-height: 14px;
    }
  `,
})
export class TabsPage {
  protected readonly deck = inject(DeckStore);
  constructor() {
    addIcons({ albumsOutline, layersOutline, settingsOutline });
  }
}
