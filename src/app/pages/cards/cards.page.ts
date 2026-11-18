import type { OnInit } from '@angular/core';
import { Component, computed, inject, signal } from '@angular/core';
import {
  IonBadge,
  IonChip,
  IonContent,
  IonHeader,
  IonSearchbar,
  IonSpinner,
  IonTitle,
  IonToolbar,
  ToastController,
} from '@ionic/angular';

import { CardsService } from '../../core/cards.service';
import { allowedInFormat, maxCopies } from '../../core/deck-rules';
import { DeckStore } from '../../core/deck.store';
import type { Card, Format } from '../../core/models';
import { cardImage, CLASS_COLORS, CLASS_LABELS, FORMAT_LABELS } from '../../core/models';
import { SettingsStore } from '../../core/settings.store';

const PAGE = 48;
const MANA = [0, 1, 2, 3, 4, 5, 6, 7] as const;

@Component({
  selector: 'app-cards',
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonSearchbar, IonChip, IonSpinner, IonBadge],
  templateUrl: './cards.page.html',
  styleUrl: './cards.page.scss',
})
export class CardsPage implements OnInit {
  protected readonly cardsService = inject(CardsService);
  protected readonly deck = inject(DeckStore);
  private readonly toast = inject(ToastController);
  protected readonly settings = inject(SettingsStore);
  protected readonly formatLabels = FORMAT_LABELS;

  protected readonly mana = MANA;
  protected readonly query = signal('');
  protected readonly manaFilter = signal<number | null>(null);
  protected readonly classFilter = signal<'ALL' | 'CLASS' | 'NEUTRAL'>('ALL');
  protected readonly visible = signal(PAGE);

  protected readonly filtered = computed(() => {
    const q = this.query().trim().toLowerCase();
    const mana = this.manaFilter();
    const cls = this.classFilter();
    const heroClass = this.deck.deck()?.heroClass;
    const format = this.format();
    return this.cardsService
      .cards()
      .filter((c) => {
        if (!allowedInFormat(c, format)) return false;
        if (mana !== null && (mana === 7 ? c.cost < 7 : c.cost !== mana)) return false;
        if (cls === 'NEUTRAL' && c.cardClass !== 'NEUTRAL') return false;
        if (cls === 'CLASS' && c.cardClass !== (heroClass ?? c.cardClass)) return false;
        if (cls === 'ALL' && heroClass && c.cardClass !== 'NEUTRAL' && c.cardClass !== heroClass) return false;
        return !q || c.name.toLowerCase().includes(q) || c.text.toLowerCase().includes(q);
      })
      .sort((a, b) => a.cost - b.cost || a.name.localeCompare(b.name));
  });
  /** Con un mazzo selezionato vale il suo formato, altrimenti quello scelto qui. */
  protected readonly format = computed<Format>(() => this.deck.deck()?.format ?? this.settings.format());

  protected readonly shown = computed(() => this.filtered().slice(0, this.visible()));

  protected readonly classLabel = computed(() => {
    const c = this.deck.deck()?.heroClass;
    return c ? CLASS_LABELS[c] : 'Tutte le classi';
  });
  protected readonly classColor = computed(() => CLASS_COLORS[this.deck.deck()?.heroClass ?? 'NEUTRAL']);

  ngOnInit(): void {
    void this.cardsService.load();
  }

  protected image(card: Card): string {
    return cardImage(card);
  }

  protected search(ev: Event): void {
    this.query.set((ev as CustomEvent<{ value?: string | null }>).detail.value ?? '');
    this.visible.set(PAGE);
  }

  protected setFormat(f: Format): void {
    if (this.deck.deck()) return;
    this.settings.setFormat(f);
    this.visible.set(PAGE);
  }

  protected setMana(m: number | null): void {
    this.manaFilter.set(this.manaFilter() === m ? null : m);
    this.visible.set(PAGE);
  }

  protected setClass(c: 'ALL' | 'CLASS' | 'NEUTRAL'): void {
    this.classFilter.set(c);
    this.visible.set(PAGE);
  }

  protected more(ev: Event): void {
    const el = ev.target as HTMLElement;
    if (el.scrollTop + el.clientHeight > el.scrollHeight - 600) this.visible.update((v) => v + PAGE);
  }

  protected copies(card: Card): number {
    return this.deck.countOf(card.dbfId);
  }

  protected max(card: Card): number {
    return maxCopies(card);
  }

  protected async add(card: Card): Promise<void> {
    const messages = {
      ok: '',
      full: 'Il mazzo è completo (30 carte).',
      'max-copies': card.rarity === 'LEGENDARY' ? 'Le leggendarie sono max 1.' : 'Massimo 2 copie.',
      'wrong-class': 'Crea prima un mazzo dal tab Mazzo.',
      'wrong-format': 'Carta non ammessa in un mazzo Standard.',
    };
    const result = this.deck.add(card);
    if (result === 'ok') {
      void navigator.vibrate?.(8);
      return;
    }
    const t = await this.toast.create({ message: messages[result], duration: 1400, position: 'top', color: 'dark' });
    await t.present();
  }
}
