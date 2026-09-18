import { Routes } from '@angular/router';
import { RICARDO_CARD_PATH } from './features/public-profile/data/ricardo-card.data';

export const routes: Routes = [
  {
    path: RICARDO_CARD_PATH,
    loadComponent: () => import('./features/public-profile/presentation/public-profile.page').then((m) => m.PublicProfilePage),
  },
  {
    path: '**',
    redirectTo: RICARDO_CARD_PATH,
  },
];
