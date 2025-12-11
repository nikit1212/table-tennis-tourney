import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Store } from '@ngrx/store';
import { PlayersTableComponent } from './components/players-table/players-table.component';
import { MatchesListComponent } from './components/matches-list/matches-list.component'; // Импорт нового компонента
import * as TournamentActions from './store/tournament/tournament.actions';
import { TournamentState } from './store/tournament/tournament.reducer';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    PlayersTableComponent,
    MatchesListComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  private store = inject(Store<{ tournament: TournamentState }>);

  loadTournament(event: any) {
    const file = event.target.files?.[0];
    if (file) {
      this.store.dispatch(TournamentActions.loadTournament({ file }));
    }
  }

  generateMatches() {
    this.store.dispatch(TournamentActions.generateMatches());
  }
}
