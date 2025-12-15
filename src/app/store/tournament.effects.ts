import {inject, Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {TournamentApiService} from '../services/tournament-api.service';
import * as TournamentActions from './tournament.actions';
import {catchError, map, mergeMap, of} from 'rxjs';

@Injectable()
export class TournamentEffects {
  private actions$ = inject(Actions);
  private api = inject(TournamentApiService);

  loadPlayers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TournamentActions.loadPlayers),
      mergeMap(() =>
        this.api.getPlayers(true).pipe(
          map(players => TournamentActions.loadPlayersSuccess({players})),
          catchError(err =>
            of(TournamentActions.loadPlayersFailure({error: err.message || 'Load players error'}))
          )
        )
      )
    )
  );

  loadTournaments$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TournamentActions.loadTournaments),
      mergeMap(() =>
        this.api.getTournaments('all').pipe(
          map(tournaments => TournamentActions.loadTournamentsSuccess({tournaments})),
          catchError(err =>
            of(TournamentActions.loadTournamentsFailure({error: err.message || 'Load tournaments error'}))
          )
        )
      )
    )
  );

  loadHistory$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TournamentActions.loadHistory),
      mergeMap(() =>
        this.api.getHistory().pipe(
          map(history => TournamentActions.loadHistorySuccess({history})),
          catchError(err =>
            of(
              TournamentActions.loadHistoryFailure({
                error: err.message || 'Load history error'
              })
            )
          )
        )
      )
    )
  );

  loadTournamentDetails$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TournamentActions.loadTournamentDetails),
      mergeMap(({id}) =>
        this.api.getTournamentDetails(id).pipe(
          map(details => TournamentActions.loadTournamentDetailsSuccess({details})),
          catchError(err =>
            of(
              TournamentActions.loadTournamentDetailsFailure({
                error: err.message || 'Load tournament details error'
              })
            )
          )
        )
      )
    )
  );

  createPlayer$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TournamentActions.createPlayerRequest),
      mergeMap(({first_name, last_name, gender}) =>
        this.api.createPlayer(first_name, last_name, gender).pipe(
          // после создания просто перезагружаем список
          map(() => TournamentActions.loadPlayers()),
          catchError(err =>
            of(TournamentActions.loadPlayersFailure({error: err.message || 'Create player error'}))
          )
        )
      )
    )
  );

  deletePlayer$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TournamentActions.deletePlayerRequest),
      mergeMap(({id}) =>
        this.api.deletePlayer(id).pipe(
          map(() => TournamentActions.loadPlayers()),
          catchError(err =>
            of(TournamentActions.loadPlayersFailure({error: err.message || 'Delete player error'}))
          )
        )
      )
    )
  );

  createTournament$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TournamentActions.createTournamentRequest),
      mergeMap(({name}) =>
        this.api.createTournament(name).pipe(
          map(() => TournamentActions.loadTournaments()),
          catchError(err =>
            of(
              TournamentActions.loadTournamentsFailure({
                error: err.message || 'Create tournament error'
              })
            )
          )
        )
      )
    )
  );

  selectTournament$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TournamentActions.selectTournament),
      mergeMap(({id}) => [
        TournamentActions.loadTournamentDetails({id}),
        TournamentActions.loadMatches({tournamentId: id}),
        TournamentActions.loadStandings({tournamentId: id})
      ])
    )
  );

  loadMatches$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TournamentActions.loadMatches),
      mergeMap(({tournamentId}) =>
        this.api.getMatches(tournamentId).pipe(
          map(matches => TournamentActions.loadMatchesSuccess({matches})),
          catchError(err =>
            of(
              TournamentActions.loadMatchesFailure({
                error: err.message || 'Load matches error'
              })
            )
          )
        )
      )
    )
  );

  loadStandings$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TournamentActions.loadStandings),
      mergeMap(({tournamentId}) =>
        this.api.getStandings(tournamentId).pipe(
          map(standings => TournamentActions.loadStandingsSuccess({standings})),
          catchError(err =>
            of(
              TournamentActions.loadStandingsFailure({
                error: err.message || 'Load standings error'
              })
            )
          )
        )
      )
    )
  );

  addParticipants$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TournamentActions.addParticipantsRequest),
      mergeMap(({tournamentId, playerIds}) =>
        this.api.addParticipants(tournamentId, playerIds).pipe(
          mergeMap(() => [
            TournamentActions.loadTournamentDetails({id: tournamentId}),
            TournamentActions.loadPlayers()
          ]),
          catchError(err =>
            of(
              TournamentActions.loadTournamentDetailsFailure({
                error: err.message || 'Add participants error'
              })
            )
          )
        )
      )
    )
  );

  generateMatches$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TournamentActions.generateMatchesRequest),
      mergeMap(({tournamentId}) =>
        this.api.generateMatches(tournamentId).pipe(
          mergeMap(() => [
            TournamentActions.loadMatches({tournamentId}),
            TournamentActions.loadStandings({tournamentId})
          ]),
          catchError(err =>
            of(
              TournamentActions.loadMatchesFailure({
                error: err.message || 'Generate matches error'
              })
            )
          )
        )
      )
    )
  );

  updateMatchScore$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TournamentActions.updateMatchScoreRequest),
      mergeMap(({matchId, team1_score, team2_score, tournamentId}) =>
        this.api.updateMatchScore(matchId, team1_score, team2_score).pipe(
          mergeMap(() => [
            TournamentActions.loadMatches({tournamentId}),
            TournamentActions.loadStandings({tournamentId})
          ]),
          catchError(err =>
            of(
              TournamentActions.loadMatchesFailure({
                error: err.message || 'Update match score error'
              })
            )
          )
        )
      )
    )
  );

  finishTournament$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TournamentActions.finishTournament),
      mergeMap(({ id }) =>
        this.api.finishTournament(id).pipe(
          mergeMap(() => [
            TournamentActions.loadTournamentDetails({ id }),
            TournamentActions.loadHistory()
          ]),
          catchError(err => of(
            TournamentActions.finishTournamentFailure({
              id: err.id,
              error: err.message || 'Update match score error'
            })
          ))
        )
      )
    )
  );

}
