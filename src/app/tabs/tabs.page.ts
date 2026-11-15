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
            <ion-badge [color]="deck.complete() ? 'success' : 'warning'">{{ deck.count() }}/30</ion-badge>
          }
        </ion-tab-button>
        <ion-tab-button tab="settings">
          <ion-icon name="settings-outline" />
          <ion-label>Impostazioni</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  `,
})
export class TabsPage {
  protected readonly deck = inject(DeckStore);
  constructor() {
    addIcons({ albumsOutline, layersOutline, settingsOutline });
  }
}
