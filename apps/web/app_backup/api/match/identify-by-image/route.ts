import { NextRequest, NextResponse } from 'next/server';
import { Match } from '../../../../../../packages/types/database';

// Mock match data for image identification
const mockMatchForImage: Match = {
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
};

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const image = formData.get('image') as File;
    
    if (!image) {
      return NextResponse.json(
        { error: 'No image provided' },
        { status: 400 }
      );
    }

    // For now, ignore the image content and return a hardcoded match
    // This unblocks the frontend's upload UI
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    return NextResponse.json({
      matches: [mockMatchForImage],
      confidence: 0.95
    });
  } catch (error) {
    console.error('Error in image identification:', error);
    return NextResponse.json(
      { error: 'Failed to identify match from image' },
      { status: 500 }
    );
  }
}
