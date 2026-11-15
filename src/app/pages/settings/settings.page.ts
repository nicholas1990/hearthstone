import { DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonNote,
  IonRadio,
  IonRadioGroup,
  IonTitle,
  IonToolbar,
} from '@ionic/angular';

import { CardsService } from '../../core/cards.service';
import type { ProviderId } from '../../core/providers/card-provider';
import { PROVIDER_LABELS } from '../../core/providers/card-provider';
import { SettingsStore } from '../../core/settings.store';

@Component({
  selector: 'app-settings',
  imports: [
    DatePipe,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonListHeader,
    IonItem,
    IonLabel,
    IonRadioGroup,
    IonRadio,
    IonInput,
    IonNote,
    IonButton,
  ],
  templateUrl: './settings.page.html',
  styleUrl: './settings.page.scss',
})
export class SettingsPage {
  protected readonly settings = inject(SettingsStore);
  protected readonly cards = inject(CardsService);
  protected readonly providers = Object.entries(PROVIDER_LABELS) as [ProviderId, string][];

  protected choose(ev: Event): void {
    this.settings.setProvider((ev as CustomEvent<{ value: ProviderId }>).detail.value);
    void this.cards.load(true);
  }

  protected setUrl(ev: Event): void {
    this.settings.setServerUrl(String((ev as CustomEvent<{ value?: string | null }>).detail.value ?? ''));
  }

  protected refresh(): void {
    void this.cards.load(true);
  }
}
