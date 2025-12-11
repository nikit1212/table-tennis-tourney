import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { switchMap, map, catchError, from, of } from 'rxjs';
import * as TournamentActions from './tournament.actions';
import { XlsxService } from '../../services/xlsx.service';

@Injectable()
export class TournamentEffects {
  private actions$ = inject(Actions);
  private xlsxService = inject(XlsxService);

  loadTournament$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TournamentActions.loadTournament),
      switchMap(({ file }) =>
        from(this.xlsxService.loadTournament(file)).pipe(
          map(tournament => TournamentActions.loadTournamentSuccess({ tournament })),
          catchError(error => of(TournamentActions.loadTournamentFailure({ error: error.message || 'Unknown error' })))
        )
      )
    )
  );
}
