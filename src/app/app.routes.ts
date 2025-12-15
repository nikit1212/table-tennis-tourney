import { Routes } from '@angular/router';
import { PlayersPageComponent } from './pages/players-page/players-page.component';
import { TournamentsPageComponent } from './pages/tournaments-page/tournaments-page.component';
import { TournamentsHistoryPageComponent } from './pages/history-page/history-page.component';

export const routes: Routes = [
  { path: '', redirectTo: 'players', pathMatch: 'full' },
  { path: 'players', component: PlayersPageComponent },
  { path: 'history', component: TournamentsHistoryPageComponent },
  { path: 'tournaments', component: TournamentsPageComponent },
  { path: '**', redirectTo: 'players' }
];
