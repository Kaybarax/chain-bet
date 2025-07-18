// FED1T5S_MockApiClient: Mock API Client for development
export interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  competition: string;
  date: string;
  status: 'upcoming' | 'live' | 'finished';
  markets: Market[];
}

export interface Market {
  id: string;
  name: string;
  type: '1X2' | 'BTTS' | 'OVER_UNDER' | 'DOUBLE_CHANCE';
  selections: Selection[];
}

export interface Selection {
  id: string;
  name: string;
  odds: number;
  outcome: string;
}

export interface BetSlip {
  selections: BetSelection[];
  totalStake: number;
  potentialPayout: number;
}

export interface BetSelection {
  matchId: string;
  marketId: string;
  selectionId: string;
  odds: number;
  stake: number;
}

// Mock data based on Football Betting Markets data model
const mockMatches: Match[] = [
  {
    id: 'match_001',
    homeTeam: 'Manchester United',
    awayTeam: 'Liverpool',
    competition: 'Premier League',
    date: '2024-03-15T15:00:00Z',
    status: 'upcoming',
    markets: [
      {
        id: 'market_001_1x2',
        name: '1X2 Full Time',
        type: '1X2',
        selections: [
          { id: 'sel_001_home', name: 'Home', odds: 2.10, outcome: 'Home' },
          { id: 'sel_001_draw', name: 'Draw', odds: 3.40, outcome: 'Draw' },
          { id: 'sel_001_away', name: 'Away', odds: 3.20, outcome: 'Away' }
        ]
      },
      {
        id: 'market_001_btts',
        name: 'Both Teams To Score',
        type: 'BTTS',
        selections: [
          { id: 'sel_001_btts_yes', name: 'Yes', odds: 1.80, outcome: 'Yes' },
          { id: 'sel_001_btts_no', name: 'No', odds: 2.00, outcome: 'No' }
        ]
      }
    ]
  },
  {
    id: 'match_002',
    homeTeam: 'Arsenal',
    awayTeam: 'Chelsea',
    competition: 'Premier League',
    date: '2024-03-16T17:30:00Z',
    status: 'upcoming',
    markets: [
      {
        id: 'market_002_1x2',
        name: '1X2 Full Time',
        type: '1X2',
        selections: [
          { id: 'sel_002_home', name: 'Home', odds: 1.90, outcome: 'Home' },
          { id: 'sel_002_draw', name: 'Draw', odds: 3.60, outcome: 'Draw' },
          { id: 'sel_002_away', name: 'Away', odds: 4.20, outcome: 'Away' }
        ]
      }
    ]
  },
  {
    id: 'match_003',
    homeTeam: 'Real Madrid',
    awayTeam: 'Barcelona',
    competition: 'La Liga',
    date: '2024-03-17T20:00:00Z',
    status: 'upcoming',
    markets: [
      {
        id: 'market_003_1x2',
        name: '1X2 Full Time',
        type: '1X2',
        selections: [
          { id: 'sel_003_home', name: 'Home', odds: 2.50, outcome: 'Home' },
          { id: 'sel_003_draw', name: 'Draw', odds: 3.20, outcome: 'Draw' },
          { id: 'sel_003_away', name: 'Away', odds: 2.80, outcome: 'Away' }
        ]
      }
    ]
  }
];

// Mock API functions
export const mockApiClient = {
  // FED1T5S_MockApiClient: Get matches based on search query
  async getMatches(query: string = ''): Promise<Match[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (!query.trim()) {
      return mockMatches;
    }
    
    // Filter matches based on query
    return mockMatches.filter(match => 
      match.homeTeam.toLowerCase().includes(query.toLowerCase()) ||
      match.awayTeam.toLowerCase().includes(query.toLowerCase()) ||
      match.competition.toLowerCase().includes(query.toLowerCase())
    );
  },

  // Get match details by ID
  async getMatchById(matchId: string): Promise<Match | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockMatches.find(match => match.id === matchId) || null;
  },

  // Get markets for a specific match
  async getMarkets(matchId: string): Promise<Market[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    const match = mockMatches.find(m => m.id === matchId);
    return match ? match.markets : [];
  },

  // Mock AI analysis (FED2T6S_AIAnalysis)
  async analyzeBet(matchId: string, selections: BetSelection[]): Promise<any> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock probability analysis
    return {
      HomeWin: 0.45,
      Draw: 0.30,
      AwayWin: 0.25,
      Over2_5Goals: 0.62,
      BothTeamsToScore: 0.55,
      confidence: 0.78,
      recommendation: 'The model suggests a moderate probability for the home team to win based on recent form and historical data.'
    };
  }
};

export default mockApiClient;
