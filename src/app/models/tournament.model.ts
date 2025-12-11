export interface Player {
  id: number;
  name: string;
  rating: number;
  team?: string;
}

export interface Match {
  id: number;
  player1Id: number;
  player2Id: number;
  score1: number;
  score2: number;
  round: number;
  winnerId?: number;
}

export interface Tournament {
  id: string;
  name: string;
  players: Player[];
  matches: Match[];
}
