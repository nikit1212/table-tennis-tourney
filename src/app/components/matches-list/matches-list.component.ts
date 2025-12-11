import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { TournamentState } from '../../store/tournament/tournament.reducer';
import * as TournamentActions from '../../store/tournament/tournament.actions';
import { Match, Player } from '../../models/tournament.model';
import { map } from 'rxjs';

@Component({
  selector: 'app-matches-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    FormsModule
  ],
  templateUrl: "./matches-list.component.html",
  styleUrls: ["./matches-list.component.scss"]
})
export class MatchesListComponent {
  private store = inject(Store<{ tournament: TournamentState }>);

  vm$ = this.store.select(state => state.tournament.tournament).pipe(
    map(tournament => {
      if (!tournament) return { matches: [] };

      const playersMap = new Map<number, Player>();
      tournament.players.forEach((p: Player) => playersMap.set(p.id, p));

      const matchesWithNames = tournament.matches.map((match: { player1Id: number; player2Id: number; }) => ({
        match,
        p1: playersMap.get(match.player1Id) || { name: 'Unknown', id: 0 } as Player,
        p2: playersMap.get(match.player2Id) || { name: 'Unknown', id: 0 } as Player
      }));

      return { matches: matchesWithNames };
    })
  );

  updateScore(match: Match, score1: string | number, score2: string | number) {
    this.store.dispatch(TournamentActions.updateMatchScore({
      matchId: match.id,
      score1: Number(score1),
      score2: Number(score2)
    }));
  }
}
