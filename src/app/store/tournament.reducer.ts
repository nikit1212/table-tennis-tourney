import {createReducer, on} from '@ngrx/store';
import * as TournamentActions from './tournament.actions';
import {
  TournamentHistoryItem,
  TournamentDto,
  TournamentDetailsDto,
  PlayerDto,
  MatchDto,
  StandingDto
} from '../models/api.models';

export interface TournamentState {
  players: PlayerDto[];
  tournaments: TournamentDto[];
  currentTournament: TournamentDetailsDto | null;
  currentTournamentId: number | null;
  matches: MatchDto[];
  standings: StandingDto[];
  loading: boolean;
  error: string | null;
  teamPlayersMap: Record<number, PlayerDto>;
  history: TournamentHistoryItem[];
}

export const initialState: TournamentState = {
  players: [],
  tournaments: [],
  currentTournament: null,
  currentTournamentId: null,
  matches: [],
  standings: [],
  loading: false,
  error: null,
  teamPlayersMap: {},
  history: []
};

export const tournamentReducer = createReducer(
  initialState,

  on(TournamentActions.loadPlayers, state => ({...state, loading: true, error: null})),
  on(TournamentActions.loadPlayersSuccess, (state, {players}) => ({
    ...state,
    loading: false,
    players
  })),
  on(TournamentActions.loadPlayersFailure, (state, {error}) => ({
    ...state,
    loading: false,
    error
  })),
  on(TournamentActions.loadTournaments, state => ({...state, loading: true, error: null})),
  on(TournamentActions.loadTournamentsSuccess, (state, {tournaments}) => ({
    ...state,
    loading: false,
    tournaments
  })),
  on(TournamentActions.loadTournamentsFailure, (state, {error}) => ({
    ...state,
    loading: false,
    error
  })),
  on(TournamentActions.loadTournamentDetails, state => ({...state, loading: true, error: null})),
  on(TournamentActions.loadTournamentDetailsSuccess, (state, {details}) => {
    const map: Record<number, PlayerDto> = {};
    details.participants.forEach((p: any) => {
      map[p.team_id] = {
        id: p.player_id,
        first_name: p.first_name,
        last_name: p.last_name,
        gender: p.gender,
        is_active: 1
      };
    });

    return {
      ...state,
      loading: false,
      currentTournament: details,
      teamPlayersMap: map
    };
  }),
  on(TournamentActions.loadTournamentDetailsFailure, (state, {error}) => ({
    ...state,
    loading: false,
    error
  })),
  on(TournamentActions.selectTournament, (state, {id}) => ({
    ...state,
    currentTournamentId: id
  })),
  on(TournamentActions.loadMatches, state => ({...state, loading: true})),
  on(TournamentActions.loadMatchesSuccess, (state, {matches}) => ({
    ...state,
    loading: false,
    matches
  })),
  on(TournamentActions.loadMatchesFailure, (state, {error}) => ({
    ...state,
    loading: false,
    error
  })),
  on(TournamentActions.loadStandings, state => ({...state, loading: true})),
  on(TournamentActions.loadStandingsSuccess, (state, {standings}) => ({
    ...state,
    loading: false,
    standings
  })),
  on(TournamentActions.loadStandingsFailure, (state, {error}) => ({
    ...state,
    loading: false,
    error
  })),
  on(TournamentActions.loadHistorySuccess, (state, {history}) => ({
    ...state,
    history
  })),
  on(TournamentActions.loadHistoryFailure, (state, {error}) => ({
    ...state,
    error
  })),
);
