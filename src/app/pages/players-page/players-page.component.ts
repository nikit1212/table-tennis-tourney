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
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-players-page',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    ReactiveFormsModule
  ],
  templateUrl: './players-page.component.html',
  styleUrls: ['./players-page.component.scss']
})
export class PlayersPageComponent implements OnInit {
  private store = inject(Store<{ tournament: TournamentState }>);
  private fb = inject(FormBuilder);

  state$ = this.store.select(s => s.tournament);

  displayedColumns = ['id', 'name', 'gender', 'actions'];

  playerForm = this.fb.group({
    first_name: ['', Validators.required],
    last_name: ['', Validators.required],
    gender: ['M', Validators.required]
  });

  ngOnInit() {
    this.store.dispatch(TournamentActions.loadPlayers());
  }

  onCreate() {
    if (this.playerForm.invalid) return;
    const { first_name, last_name, gender } = this.playerForm.value;
    this.store.dispatch(
      TournamentActions.createPlayerRequest({
        first_name: first_name!,
        last_name: last_name!,
        gender: gender!
      })
    );
    this.playerForm.reset({ gender: 'M' });
  }

  onDelete(id: number) {
    this.store.dispatch(TournamentActions.deletePlayerRequest({ id }));
  }
}
