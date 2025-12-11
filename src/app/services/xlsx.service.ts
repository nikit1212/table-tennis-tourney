import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import { Player, Match, Tournament } from '../models/tournament.model';

@Injectable({ providedIn: 'root' })
export class XlsxService {
  async loadTournament(file: File): Promise<Tournament> {
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data, { type: 'array' });
    const playersSheet = workbook.Sheets['Players'];
    const matchesSheet = workbook.Sheets['Matches'];

    const players: Player[] = playersSheet
      ? XLSX.utils.sheet_to_json<Player>(playersSheet)
      : [];

    const matches: Match[] = matchesSheet
      ? XLSX.utils.sheet_to_json<Match>(matchesSheet)
      : [];

    return {
      id: file.name.replace('.xlsx', ''),
      name: file.name,
      players: players.map((p, i) => ({ ...p, id: i + 1 })),
      matches
    };
  }

  saveTournament(tournament: Tournament, filename: string) {
    const wb = XLSX.utils.book_new();

    const playersWs = XLSX.utils.json_to_sheet(tournament.players);
    XLSX.utils.book_append_sheet(wb, playersWs, 'Players');

    const matchesWs = XLSX.utils.json_to_sheet(tournament.matches);
    XLSX.utils.book_append_sheet(wb, matchesWs, 'Matches');

    XLSX.writeFile(wb, filename);
  }
}
