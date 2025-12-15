import {createAction, props} from '@ngrx/store';
import {
  MatchDto,
  PlayerDto,
  StandingDto,
  TournamentDetailsDto,
  TournamentDto,
  TournamentHistoryItem
} from '../models/api.models';

export enum TournamentStatus {
  success = ' Success',
  failure = ' Failure',
  loadPlayers = '[Players] Load All',
  loadTournaments = '[Tournament] Load All',
  loadTournamentDetails = '[Tournament] Load Details',
  createPlayerRequest = '[Players] Create Request',
  deletePlayerRequest = '[Players] Delete Request',
  createTournamentRequest = '[Tournament] Create Request',
  selectTournament = '[Tournament] Select Tournament',
  loadMatches = '[Tournament] Load Matches',
  loadStandings = '[Tournament] Load Standings',
  addParticipants = '[Tournament] Add Participants Request',
  generateMatches = '[Tournament] Generate Matches Request',
  updateMatchScore = '[Tournament] Update Match Score Request',
  loadHistory = '[History] load History',
  finishTournament = '[Tournament] Finish Tournament',
}

export const loadPlayers = createAction(TournamentStatus.loadPlayers);

export const loadPlayersSuccess = createAction(
  TournamentStatus + TournamentStatus.success,
  props<{ players: PlayerDto[] }>()
);

export const loadPlayersFailure = createAction(
  TournamentStatus + TournamentStatus.failure,
  props<{ error: string }>()
);

export const loadTournaments = createAction(TournamentStatus.loadTournaments);

export const loadTournamentsSuccess = createAction(
  TournamentStatus.loadTournaments + TournamentStatus.success,
  props<{ tournaments: TournamentDto[] }>()
);

export const loadTournamentsFailure = createAction(
  TournamentStatus.loadTournaments + TournamentStatus.failure,
  props<{ error: string }>()
);

export const loadTournamentDetails = createAction(
  TournamentStatus.loadTournamentDetails,
  props<{ id: number }>()
);

export const loadTournamentDetailsSuccess = createAction(
  TournamentStatus.loadTournamentDetails + TournamentStatus.success,
  props<{ details: TournamentDetailsDto }>()
);

export const loadTournamentDetailsFailure = createAction(
  TournamentStatus.loadTournamentDetails + TournamentStatus.failure,
  props<{ error: string }>()
);

export const createPlayerRequest = createAction(
  TournamentStatus.createPlayerRequest,
  props<{ first_name: string; last_name: string; gender: string }>()
);

export const deletePlayerRequest = createAction(
  TournamentStatus.deletePlayerRequest,
  props<{ id: number }>()
);

export const createTournamentRequest = createAction(
  TournamentStatus.createTournamentRequest,
  props<{ name: string }>()
);

export const selectTournament = createAction(
  TournamentStatus.selectTournament,
  props<{ id: number }>()
);

export const loadMatches = createAction(
  TournamentStatus.loadMatches,
  props<{ tournamentId: number }>()
);

export const loadMatchesSuccess = createAction(
  TournamentStatus.loadMatches + TournamentStatus.success,
  props<{ matches: MatchDto[] }>()
);

export const loadMatchesFailure = createAction(
  TournamentStatus.loadMatches + TournamentStatus.failure,
  props<{ error: string }>()
);

export const loadStandings = createAction(
  TournamentStatus.loadStandings,
  props<{ tournamentId: number }>()
);

export const loadStandingsSuccess = createAction(
  TournamentStatus.loadStandings + TournamentStatus.success,
  props<{ standings: StandingDto[] }>()
);

export const loadStandingsFailure = createAction(
  TournamentStatus.loadStandings + TournamentStatus.failure,
  props<{ error: string }>()
);

export const addParticipantsRequest = createAction(
  TournamentStatus.addParticipants,
  props<{ tournamentId: number; playerIds: number[] }>()
);

export const generateMatchesRequest = createAction(
  TournamentStatus.generateMatches,
  props<{ tournamentId: number }>()
);

export const updateMatchScoreRequest = createAction(
  TournamentStatus.updateMatchScore,
  props<{ matchId: number; team1_score: number; team2_score: number; tournamentId: number }>()
);

export const loadHistory = createAction(TournamentStatus.loadHistory);

export const loadHistorySuccess = createAction(
  TournamentStatus.loadHistory + TournamentStatus.success,
  props<{ history: TournamentHistoryItem[] }>()
);

export const loadHistoryFailure = createAction(
  TournamentStatus.loadHistory + TournamentStatus.failure,
  props<{ error: string }>()
);

export const finishTournament = createAction(
  TournamentStatus.finishTournament,
  props<{ id: number }>()
);

export const finishTournamentSucces = createAction(
  TournamentStatus.finishTournament + TournamentStatus.success,
  props<{ id: number }>()
);

export const finishTournamentFailure = createAction(
  TournamentStatus.finishTournament + TournamentStatus.failure,
  props<{ id: number, error: string }>()
);

