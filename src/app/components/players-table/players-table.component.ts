import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource } from '@angular/material/table';
import { Store } from '@ngrx/store';
import { TournamentState } from '../../store/tournament/tournament.reducer';
import {MatCard, MatCardContent, MatCardHeader, MatCardTitle} from '@angular/material/card';

interface Player {
  id: number;
  name: string;
  rating: number;
  team?: string;
}

@Component({
  selector: 'app-players-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatCardContent,
    MatCardTitle,
    MatCardHeader,
    MatCard
  ],
  templateUrl: './players-table.component.html',
  styleUrls: ['./players-table.component.scss']
})
export class PlayersTableComponent implements OnInit {
  private store = inject(Store<{ tournament: TournamentState }>);
  displayedColumns = ['name', 'rating', 'team'];
  dataSource = new MatTableDataSource<Player>([]);

  ngOnInit() {
    this.store.select(state => state.tournament.tournament?.players || []).subscribe(players => {
      this.dataSource.data = players;
    });
  }
}
