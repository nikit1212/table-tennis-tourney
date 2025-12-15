import {Component, inject, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {TournamentState} from '../../store/tournament.reducer';
import { loadHistory } from '../../store/tournament.actions';
import {AsyncPipe, DatePipe} from '@angular/common';
import {
  MatCell, MatCellDef,
  MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef, MatTable
} from '@angular/material/table';

@Component({
  selector: 'app-history-page',
  templateUrl: './history-page.component.html',
  imports: [
    AsyncPipe,
    DatePipe,
    MatHeaderCell,
    MatColumnDef,
    MatCell,
    MatHeaderRow,
    MatRow,
    MatHeaderRowDef,
    MatRowDef,
    MatHeaderCellDef,
    MatCellDef,
    MatTable
  ],
  styleUrls: ['./history-page.component.scss']
})
export class TournamentsHistoryPageComponent implements OnInit {
  private store = inject(Store<{ tournament: TournamentState }>);
  public state$ = this.store.select(s => s.tournament);

  ngOnInit() {
    this.store.dispatch(loadHistory());
  }
}
