// Football Betting Markets Data Models

export interface Match {
  _id?: string;
  matchId: string;
  homeTeam: string;
  awayTeam: string;
  competition: string;
  date: Date;
  status: 'scheduled' | 'live' | 'finished' | 'cancelled';
  markets: Market[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Market {
  marketId: string;
  name: string;
  type: MarketType;
  selections: Selection[];
  status: 'active' | 'suspended' | 'settled';
  settledAt?: Date;
  winningSelection?: string;
}

export type MarketType = 
  | '1X2'
  | 'BTTS'
  | 'TOTAL_GOALS'
  | 'ASIAN_HANDICAP'
  | 'DOUBLE_CHANCE'
  | 'CORRECT_SCORE'
  | 'BOTH_TEAMS_TO_SCORE'
  | 'CLEAN_SHEET'
  | 'EXACT_GOALS'
  | 'ODD_EVEN_GOALS'
  | 'WINNING_MARGIN'
  | 'FIRST_GOAL_SCORER'
  | 'ANYTIME_GOAL_SCORER'
  | 'CORNER_MARKETS'
  | 'CARD_MARKETS';

export interface Selection {
  selectionId: string;
  name: string;
  odds: number;
  probability?: number;
  status: 'active' | 'suspended' | 'won' | 'lost';
}

export interface Bet {
  _id?: string;
  betId: string;
  walletAddress: string;
  matchId: string;
  marketId: string;
  selectionId: string;
  stake: number;
  potentialPayout: number;
  odds: number;
  status: 'pending' | 'won' | 'lost' | 'cancelled';
  placedAt: Date;
  settledAt?: Date;
  txHash?: string;
  blockNumber?: number;
}

// Specific market selections based on the data model
export interface Market1X2 extends Market {
  type: '1X2';
  selections: [
    Selection & { name: 'Home' | 'Draw' | 'Away' }
  ];
}

export interface MarketBTTS extends Market {
  type: 'BTTS';
  selections: [
    Selection & { name: 'YES' | 'NO' }
  ];
}

export interface MarketTotalGoals extends Market {
  type: 'TOTAL_GOALS';
  line: number; // e.g., 2.5
  selections: [
    Selection & { name: 'Over' },
    Selection & { name: 'Under' }
  ];
}

export interface MarketDoubleChance extends Market {
  type: 'DOUBLE_CHANCE';
  selections: [
    Selection & { name: '1X' | '12' | 'X2' }
  ];
}

// Sample data structure for seeding
export interface SampleMatch {
  matchId: string;
  homeTeam: string;
  awayTeam: string;
  competition: string;
  date: string;
  markets: {
    '1X2': {
      home: number;
      draw: number;
      away: number;
    };
    'BTTS': {
      yes: number;
      no: number;
    };
    'TOTAL_GOALS': {
      line: number;
      over: number;
      under: number;
    };
  };
}

// API Response Types
export interface MatchSearchResponse {
  matches: Match[];
  total: number;
}

export interface MarketDetailsResponse {
  match: Match;
  markets: Market[];
}

export interface BetAnalysisResponse {
  [key: string]: number; // e.g., {"HomeWin": 0.45, "Over2_5Goals": 0.62}
}

export interface UserBetsResponse {
  bets: Bet[];
  total: number;
}

export interface ImageMatchResponse {
  matches: Match[];
  confidence: number;
}
