export interface PlayerDto {
  id: number;
  first_name: string;
  last_name: string;
  gender: string;
  is_active: number;
}

export type TournamentStatuses = 'draft' | 'in_progress' | 'finished' | 'cancelled' | 'all';

export interface TournamentDto {
  id: number;
  name: string;
  mode: string;
  team_type: string;
  points_to_win: number;
  best_of: number;
  status: TournamentStatuses;
  created_at: string;
  finished_at: string | null;
}

export interface TournamentDetailsDto {
  tournament: TournamentDto;
  participants: any[];
  matches: any[];
}

export interface MatchDto {
  id: number;
  tournament_id: number;
  round_number: number;
  match_number: number;
  team1_id: number;
  team2_id: number;
  team1_score: number;
  team2_score: number;
  winner_team_id: number | null;
  status: string;
}

export interface StandingDto {
  player_id: number;
  first_name: string;
  last_name: string;
  played: number;
  won: number;
  lost: number;
  sets_won: number;
  sets_lost: number;
  points: number;
}


export interface TournamentHistoryItem extends TournamentDto {}
