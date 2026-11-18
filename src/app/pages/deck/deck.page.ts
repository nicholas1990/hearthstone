import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  ActionSheetController,
  AlertController,
  ToastController,
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
import { addCircleOutline, downloadOutline, ellipsisHorizontal, removeCircleOutline } from 'ionicons/icons';

import { CardsService } from '../../core/cards.service';
import { exportDeckCode, importDeckCode } from '../../core/deck-code';
import { deckCount, illegalCards } from '../../core/deck-rules';
import { DeckStore } from '../../core/deck.store';
import type { Card, Deck, HeroClass } from '../../core/models';
import { cardTile, CLASS_COLORS, CLASS_LABELS, DECK_SIZE, FORMAT_LABELS, HERO_CLASSES } from '../../core/models';

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
  private readonly toast = inject(ToastController);
  private readonly cardsService = inject(CardsService);

  protected readonly size = DECK_SIZE;
  protected readonly color = computed(() => CLASS_COLORS[this.store.deck()?.heroClass ?? 'NEUTRAL']);
  protected readonly label = computed(() => CLASS_LABELS[this.store.deck()?.heroClass ?? 'NEUTRAL']);
  protected readonly bars = computed(() => {
    const curve = this.store.curve();
    const max = Math.max(1, ...curve);
    return curve.map((n, i) => ({ n, h: (n / max) * 100, label: i === 7 ? '7+' : String(i) }));
  });

  constructor() {
    addIcons({ addCircleOutline, downloadOutline, ellipsisHorizontal, removeCircleOutline });
  }

  protected classColor(c: HeroClass): string {
    return CLASS_COLORS[c];
  }

  protected tile(card: Card): string {
    return cardTile(card);
  }

  protected readonly formatLabels = FORMAT_LABELS;
  protected readonly illegal = computed(() => {
    const d = this.store.deck();
    return d ? illegalCards(d) : 0;
  });

  protected total(deck: Deck): number {
    return deckCount(deck);
  }

  /** Nuovo mazzo: prima la classe, poi il formato. */
  protected async newDeck(): Promise<void> {
    const classSheet = await this.sheet.create({
      header: 'Classe del mazzo',
      buttons: [
        ...HERO_CLASSES.map((c) => ({ text: CLASS_LABELS[c], handler: () => void this.chooseFormat(c) })),
        { text: 'Annulla', role: 'cancel' },
      ],
    });
    await classSheet.present();
  }

  private async chooseFormat(heroClass: HeroClass): Promise<void> {
    const formatSheet = await this.sheet.create({
      header: 'Formato',
      subHeader: 'Standard accetta solo le carte dei set in rotazione',
      buttons: [
        ...(['standard', 'wild'] as const).map((f) => ({
          text: FORMAT_LABELS[f],
          handler: () => {
            this.store.create(heroClass, f);
            void this.router.navigateByUrl('/cards');
          },
        })),
        { text: 'Annulla', role: 'cancel' },
      ],
    });
    await formatSheet.present();
  }

  protected async menu(): Promise<void> {
    const deck = this.store.deck();
    if (!deck) return;
    const sheet = await this.sheet.create({
      header: deck.name,
      buttons: [
        { text: 'Copia codice', handler: () => void this.copyCode(deck) },
        { text: 'Rinomina', handler: () => void this.rename(deck) },
        { text: 'Duplica', handler: () => this.store.duplicate(deck.id) },
        { text: 'Elimina', role: 'destructive', handler: () => void this.confirmDelete(deck) },
        { text: 'Annulla', role: 'cancel' },
      ],
    });
    await sheet.present();
  }

  private async say(message: string): Promise<void> {
    const t = await this.toast.create({ message, duration: 2500, position: 'top' });
    await t.present();
  }

  private async copyCode(deck: Deck): Promise<void> {
    const code = exportDeckCode(deck);
    try {
      await navigator.clipboard.writeText(code);
      await this.say('Codice copiato negli appunti.');
    } catch {
      const alert = await this.alert.create({
        header: 'Codice mazzo',
        inputs: [{ name: 'code', type: 'textarea', value: code }],
        buttons: ['Chiudi'],
      });
      await alert.present();
    }
  }

  protected async importCode(): Promise<void> {
    let pasted = '';
    try {
      pasted = (await navigator.clipboard.readText()).trim();
    } catch {
      /* appunti non leggibili: si incolla a mano */
    }
    const alert = await this.alert.create({
      header: 'Importa un codice mazzo',
      message: 'Incolla il codice copiato da Hearthstone o da un altro sito.',
      inputs: [{ name: 'code', type: 'textarea', value: pasted.length < 400 ? pasted : '' }],
      buttons: [
        { text: 'Annulla', role: 'cancel' },
        { text: 'Importa', handler: (v: { code: string }) => void this.doImport(v.code) },
      ],
    });
    await alert.present();
  }

  private async doImport(raw: string): Promise<void> {
    // i codici copiati da Hearthstone hanno righe di commento che iniziano con '#'
    const code = raw
      .split('\n')
      .map((l) => l.trim())
      .find((l) => l && !l.startsWith('#'));
    if (!code) return void this.say('Nessun codice incollato.');
    await this.cardsService.load();
    try {
      const { deck, skipped } = importDeckCode(code, this.cardsService.cards());
      this.store.addDeck(deck);
      await this.say(skipped ? `Importato, ${skipped} carte non ammesse o sconosciute.` : 'Mazzo importato.');
    } catch (e) {
      await this.say(e instanceof Error ? e.message : 'Codice non valido.');
    }
  }

  private async rename(deck: Deck): Promise<void> {
    const alert = await this.alert.create({
      header: 'Rinomina il mazzo',
      inputs: [{ name: 'name', type: 'text', value: deck.name, attributes: { maxlength: 40 } }],
      buttons: [
        { text: 'Annulla', role: 'cancel' },
        { text: 'Salva', handler: (v: { name: string }) => this.store.rename(deck.id, v.name) },
      ],
    });
    await alert.present();
  }

  private async confirmDelete(deck: Deck): Promise<void> {
    const alert = await this.alert.create({
      header: `Eliminare «${deck.name}»?`,
      message: 'Le carte scelte verranno perse.',
      buttons: [
        { text: 'Annulla', role: 'cancel' },
        { text: 'Elimina', role: 'destructive', handler: () => this.store.delete(deck.id) },
      ],
    });
    await alert.present();
  }
}
