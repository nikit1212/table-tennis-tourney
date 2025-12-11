import { createAction, props } from '@ngrx/store';
import { Player, Match, Tournament } from '../../models/tournament.model';

export const loadTournament = createAction('[Tournament] Load Tournament', props<{ file: File }>());
export const loadTournamentSuccess = createAction('[Tournament] Load Success', props<{ tournament: Tournament }>());
export const loadTournamentFailure = createAction('[Tournament] Load Failure', props<{ error: string }>());
export const addPlayer = createAction('[Tournament] Add Player', props<{ player: Player }>());
export const generateMatches = createAction('[Tournament] Generate Matches');
export const updateMatchScore = createAction('[Tournament] Update Match', props<{ matchId: number, score1: number, score2: number }>());
