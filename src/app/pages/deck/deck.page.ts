import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  ActionSheetController,
  AlertController,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonLabel,
  IonList,
  IonTitle,
  IonToolbar,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { addCircleOutline, removeCircleOutline, trashOutline } from 'ionicons/icons';

import { DeckStore } from '../../core/deck.store';
import { cardTile, CLASS_COLORS, CLASS_LABELS, DECK_SIZE, HERO_CLASSES } from '../../core/models';

@Component({
  selector: 'app-deck',
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonContent,
    IonList,
    IonItem,
    IonItemSliding,
    IonItemOptions,
    IonItemOption,
    IonLabel,
    IonIcon,
  ],
  templateUrl: './deck.page.html',
  styleUrl: './deck.page.scss',
})
export class DeckPage {
  protected readonly store = inject(DeckStore);
  private readonly sheet = inject(ActionSheetController);
  private readonly alert = inject(AlertController);
  private readonly router = inject(Router);

  protected readonly size = DECK_SIZE;
  protected readonly color = computed(() => CLASS_COLORS[this.store.deck()?.heroClass ?? 'NEUTRAL']);
  protected readonly label = computed(() => CLASS_LABELS[this.store.deck()?.heroClass ?? 'NEUTRAL']);
  protected readonly bars = computed(() => {
    const curve = this.store.curve();
    const max = Math.max(1, ...curve);
    return curve.map((n, i) => ({ n, h: (n / max) * 100, label: i === 7 ? '7+' : String(i) }));
  });

  constructor() {
    addIcons({ addCircleOutline, removeCircleOutline, trashOutline });
  }

  protected tile(id: string): string {
    return cardTile(id);
  }

  protected async chooseClass(): Promise<void> {
    const sheet = await this.sheet.create({
      header: 'Classe del mazzo',
      buttons: [
        ...HERO_CLASSES.map((c) => ({
          text: CLASS_LABELS[c],
          handler: () => {
            this.store.start(c);
            void this.router.navigateByUrl('/cards');
          },
        })),
        { text: 'Annulla', role: 'cancel' },
      ],
    });
    await sheet.present();
  }

  protected async reset(): Promise<void> {
    const alert = await this.alert.create({
      header: 'Eliminare il mazzo?',
      message: 'Le carte scelte verranno perse.',
      buttons: [
        { text: 'Annulla', role: 'cancel' },
        { text: 'Elimina', role: 'destructive', handler: () => this.store.clear() },
      ],
    });
    await alert.present();
  }
}
