import type { Routes } from '@angular/router';

import { TabsPage } from './tabs.page';

export const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      { path: 'cards', loadComponent: () => import('../pages/cards/cards.page').then((m) => m.CardsPage) },
      { path: 'deck', loadComponent: () => import('../pages/deck/deck.page').then((m) => m.DeckPage) },
      {
        path: 'settings',
        loadComponent: () => import('../pages/settings/settings.page').then((m) => m.SettingsPage),
      },
      { path: '', redirectTo: 'cards', pathMatch: 'full' },
    ],
  },
];
