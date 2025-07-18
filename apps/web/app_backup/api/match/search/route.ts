import { NextRequest, NextResponse } from 'next/server';
import { Match } from '../../../../../packages/types/database';

// Mock data following the Football Betting Markets data model
const mockMatches: Match[] = [
  {
    matchId: 'match_001',
    homeTeam: 'Manchester United',
    awayTeam: 'Liverpool',
    competition: 'Premier League',
    date: new Date('2024-03-15T15:00:00Z'),
    status: 'scheduled',
    markets: [
      {
        marketId: 'market_001_1x2',
        name: '1X2 Full Time',
        type: '1X2',
        selections: [
          { selectionId: 'sel_001_home', name: 'Home', odds: 2.10, status: 'active' },
          { selectionId: 'sel_001_draw', name: 'Draw', odds: 3.40, status: 'active' },
          { selectionId: 'sel_001_away', name: 'Away', odds: 3.20, status: 'active' }
        ],
        status: 'active'
      },
      {
        marketId: 'market_001_btts',
        name: 'Both Teams To Score',
        type: 'BTTS',
        selections: [
          { selectionId: 'sel_001_btts_yes', name: 'YES', odds: 1.70, status: 'active' },
          { selectionId: 'sel_001_btts_no', name: 'NO', odds: 2.15, status: 'active' }
        ],
        status: 'active'
      },
      {
        marketId: 'market_001_total',
        name: 'Total Goals Over/Under 2.5',
        type: 'TOTAL_GOALS',
        selections: [
          { selectionId: 'sel_001_over', name: 'Over', odds: 1.85, status: 'active' },
          { selectionId: 'sel_001_under', name: 'Under', odds: 1.95, status: 'active' }
        ],
        status: 'active'
      }
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    matchId: 'match_002',
    homeTeam: 'Barcelona',
    awayTeam: 'Real Madrid',
    competition: 'La Liga',
    date: new Date('2024-03-16T20:00:00Z'),
    status: 'scheduled',
    markets: [
      {
        marketId: 'market_002_1x2',
        name: '1X2 Full Time',
        type: '1X2',
        selections: [
          { selectionId: 'sel_002_home', name: 'Home', odds: 2.30, status: 'active' },
          { selectionId: 'sel_002_draw', name: 'Draw', odds: 3.20, status: 'active' },
          { selectionId: 'sel_002_away', name: 'Away', odds: 3.10, status: 'active' }
        ],
        status: 'active'
      },
      {
        marketId: 'market_002_btts',
        name: 'Both Teams To Score',
        type: 'BTTS',
        selections: [
          { selectionId: 'sel_002_btts_yes', name: 'YES', odds: 1.65, status: 'active' },
          { selectionId: 'sel_002_btts_no', name: 'NO', odds: 2.20, status: 'active' }
        ],
        status: 'active'
      },
      {
        marketId: 'market_002_total',
        name: 'Total Goals Over/Under 2.5',
        type: 'TOTAL_GOALS',
        selections: [
          { selectionId: 'sel_002_over', name: 'Over', odds: 1.80, status: 'active' },
          { selectionId: 'sel_002_under', name: 'Under', odds: 2.00, status: 'active' }
        ],
        status: 'active'
      }
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    matchId: 'match_003',
    homeTeam: 'Bayern Munich',
    awayTeam: 'Borussia Dortmund',
    competition: 'Bundesliga',
    date: new Date('2024-03-17T17:30:00Z'),
    status: 'scheduled',
    markets: [
      {
        marketId: 'market_003_1x2',
        name: '1X2 Full Time',
        type: '1X2',
        selections: [
          { selectionId: 'sel_003_home', name: 'Home', odds: 1.90, status: 'active' },
          { selectionId: 'sel_003_draw', name: 'Draw', odds: 3.60, status: 'active' },
          { selectionId: 'sel_003_away', name: 'Away', odds: 4.20, status: 'active' }
        ],
        status: 'active'
      },
      {
        marketId: 'market_003_btts',
        name: 'Both Teams To Score',
        type: 'BTTS',
        selections: [
          { selectionId: 'sel_003_btts_yes', name: 'YES', odds: 1.75, status: 'active' },
          { selectionId: 'sel_003_btts_no', name: 'NO', odds: 2.05, status: 'active' }
        ],
        status: 'active'
      },
      {
        marketId: 'market_003_total',
        name: 'Total Goals Over/Under 2.5',
        type: 'TOTAL_GOALS',
        selections: [
          { selectionId: 'sel_003_over', name: 'Over', odds: 1.90, status: 'active' },
          { selectionId: 'sel_003_under', name: 'Under', odds: 1.90, status: 'active' }
        ],
        status: 'active'
      }
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || '';

  // Filter matches based on search query
  const filteredMatches = mockMatches.filter(match => 
    match.homeTeam.toLowerCase().includes(query.toLowerCase()) ||
    match.awayTeam.toLowerCase().includes(query.toLowerCase()) ||
    match.competition.toLowerCase().includes(query.toLowerCase())
  );

  return NextResponse.json({
    matches: filteredMatches,
    total: filteredMatches.length
  });
}
