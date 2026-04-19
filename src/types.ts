export interface Player {
  id: string;
  name: string;
  position: 'GK' | 'DEF' | 'MID' | 'FWD';
  rating: number;
  fitness: number;
  value: number;
}

export interface Match {
  id: string;
  opponent: string;
  opponentRating: number;
  date: string;
  result?: {
    homeScore: number;
    awayScore: number;
  };
  earnings?: number;
}

export interface TeamStats {
  wins: number;
  draws: number;
  losses: number;
  totalEarnings: number;
  balance: number;
}
