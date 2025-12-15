import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {
  MatchDto,
  PlayerDto,
  StandingDto,
  TournamentDetailsDto,
  TournamentDto,
  TournamentHistoryItem, TournamentStatuses
} from '../models/api.models';

const API_BASE = 'http://localhost:3000/api';

@Injectable({providedIn: 'root'})
export class TournamentApiService {
  private http: HttpClient = inject(HttpClient);

  getPlayers(activeOnly = true): Observable<PlayerDto[]> {
    return this.http.get<PlayerDto[]>(`${API_BASE}/players`, {
      params: {activeOnly: String(activeOnly)}
    });
  }

  createPlayer(first_name: string, last_name: string, gender: string): Observable<PlayerDto> {
    return this.http.post<PlayerDto>(`${API_BASE}/players`, {first_name, last_name, gender});
  }

  updatePlayer(id: number, data: Partial<PlayerDto>): Observable<PlayerDto> {
    return this.http.put<PlayerDto>(`${API_BASE}/players/${id}`, data);
  }

  deletePlayer(id: number): Observable<void> {
    return this.http.delete<void>(`${API_BASE}/players/${id}`);
  }

  getTournaments(status: TournamentStatuses = 'all'): Observable<TournamentDto[]> {
    return this.http.get<TournamentDto[]>(`${API_BASE}/tournaments`, {
      params: {status}
    });
  }

  getHistory(): Observable<TournamentHistoryItem[]> {
    return this.getTournaments('finished');
  }

  createTournament(name: string): Observable<TournamentDto> {
    return this.http.post<TournamentDto>(`${API_BASE}/tournaments`, {
      name,
      mode: 'round_robin',
      team_type: 'single',
      points_to_win: 11,
      best_of: 3
    });
  }

  getTournamentDetails(id: number): Observable<TournamentDetailsDto> {
    return this.http.get<TournamentDetailsDto>(`${API_BASE}/tournaments/${id}`);
  }

  addParticipants(tournamentId: number, playerIds: number[]): Observable<{ added: number }> {
    return this.http.post<{ added: number }>(
      `${API_BASE}/tournaments/${tournamentId}/participants`,
      {player_ids: playerIds}
    );
  }

  generateMatches(tournamentId: number): Observable<{ created: number }> {
    return this.http.post<{ created: number }>(
      `${API_BASE}/tournaments/${tournamentId}/generate-matches`,
      {}
    );
  }

  getLeaderboard(mode = 'single_1x1', limit = 10) {
    return this.http.get<any[]>(`${API_BASE}/leaderboard`, {
      params: {mode, limit}
    });
  }

  getMatches(tournamentId: number) {
    return this.http.get<MatchDto[]>(`${API_BASE}/tournaments/${tournamentId}/matches`);
  }

  getStandings(tournamentId: number) {
    return this.http.get<StandingDto[]>(`${API_BASE}/tournaments/${tournamentId}/standings`);
  }

  updateMatchScore(matchId: number, team1_score: number, team2_score: number) {
    return this.http.put<MatchDto>(`${API_BASE}/matches/${matchId}/score`, {team1_score, team2_score});
  }

  finishTournament(id: number) {
    return this.http.post(`/api/tournaments/${id}/finish`, {});
  }
}
