import { createReducer, on } from '@ngrx/store';
import * as TournamentActions from './tournament.actions';
import { Tournament, Match, Player } from '../../models/tournament.model';

export interface TournamentState {
  tournament: Tournament | null;
  loading: boolean;
  error: string | null;
}

export const initialState: TournamentState = {
  tournament: null,
  loading: false,
  error: null
};

// функция для генерации матчей (каждый с каждым)
function generateRoundRobin(players: Player[]): Match[] {
  const matches: Match[] = [];
  let matchId = 1;

  for (let i = 0; i < players.length; i++) {
    for (let j = i + 1; j < players.length; j++) {
      matches.push({
        id: matchId++,
        player1Id: players[i].id,
        player2Id: players[j].id,
        score1: 0,
        score2: 0,
        round: 1
      });
    }
  }
  return matches;
}

export const tournamentReducer = createReducer(
  initialState,

  // Загрузка
  on(TournamentActions.loadTournament, state => ({ ...state, loading: true, error: null })),
  on(TournamentActions.loadTournamentSuccess, (state, { tournament }) => ({
    ...state,
    tournament,
    loading: false,
    error: null
  })),
  on(TournamentActions.loadTournamentFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Генерация матчей
  on(TournamentActions.generateMatches, state => {
    if (!state.tournament || state.tournament.players.length < 2) return state;

    const newMatches = generateRoundRobin(state.tournament.players);
    return {
      ...state,
      tournament: {
        ...state.tournament,
        matches: newMatches
      }
    };
  }),

  // Обновление счета
  on(TournamentActions.updateMatchScore, (state, { matchId, score1, score2 }) => {
    if (!state.tournament) return state;

    const updatedMatches = state.tournament.matches.map(match =>
      match.id === matchId
        ? { ...match, score1, score2, winnerId: score1 > score2 ? match.player1Id : (score2 > score1 ? match.player2Id : undefined) }
        : match
    );

    return {
      ...state,
      tournament: {
        ...state.tournament,
        matches: updatedMatches
      }
    };
  })
);
