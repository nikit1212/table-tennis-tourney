import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { TournamentState } from '../../store/tournament.reducer';
import * as TournamentActions from '../../store/tournament.actions';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatCheckbox } from '@angular/material/checkbox';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-tournaments-page',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    ReactiveFormsModule,
    MatCheckbox
  ],
  templateUrl: './tournaments-page.component.html',
  styleUrls: ['./tournaments-page.component.scss']
})
export class TournamentsPageComponent implements OnInit {
  private store = inject(Store<{ tournament: TournamentState }>);
  private fb = inject(FormBuilder);

  currentTournamentId: number | null = null;

  state$ = this.store.select(s => s.tournament);

  displayedColumns = ['id', 'name', 'status', 'actions'];

  tournamentForm = this.fb.group({
    name: ['', Validators.required]
  });

  // выбор игроков для добавления
  selectedPlayerIds: number[] = [];

  ngOnInit() {
    this.store.dispatch(TournamentActions.loadTournaments());
    this.store.dispatch(TournamentActions.loadPlayers());

    this.state$
      .pipe(untilDestroyed(this))
      .subscribe(s => {
        this.currentTournamentId = s.currentTournamentId;
      });
  }

  onCreate() {
    if ( this.tournamentForm.invalid ) return;
    const { name } = this.tournamentForm.value;
    this.store.dispatch(TournamentActions.createTournamentRequest({ name: name! }));
    this.tournamentForm.reset();
  }

  updateScore(matchId: number, t1: string | number, t2: string | number) {
    if ( !this.currentTournamentId ) return;
    this.store.dispatch(
      TournamentActions.updateMatchScoreRequest({
        matchId,
        team1_score: Number(t1),
        team2_score: Number(t2),
        tournamentId: this.currentTournamentId
      })
    );
  }

  selectTournament(id: number) {
    this.store.dispatch(TournamentActions.selectTournament({ id }));
  }

  addParticipants(tournamentId: number) {
    if ( this.selectedPlayerIds.length === 0 ) return;
    this.store.dispatch(
      TournamentActions.addParticipantsRequest({
        tournamentId,
        playerIds: this.selectedPlayerIds
      })
    );
    this.selectedPlayerIds = [];
  }

  generateMatches(tournamentId: number) {
    this.store.dispatch(TournamentActions.generateMatchesRequest({ tournamentId }));
  }

  togglePlayerSelection(playerId: number, checked: boolean) {
    if ( checked ) {
      if ( !this.selectedPlayerIds.includes(playerId) ) {
        this.selectedPlayerIds.push(playerId);
      }
    } else {
      this.selectedPlayerIds = this.selectedPlayerIds.filter(id => id !== playerId);
    }
  }
}
