import { NextRequest, NextResponse } from 'next/server';
import { BetAnalysisResponse } from '../../../../../../packages/types/database';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Mock analysis response with sample probabilities
    const mockAnalysis: BetAnalysisResponse = {
      "HomeWin": 0.45,
      "Draw": 0.25,
      "AwayWin": 0.30,
      "Over2_5Goals": 0.62,
      "Under2_5Goals": 0.38,
      "BothTeamsToScore": 0.68,
      "BothTeamsNotToScore": 0.32,
      "HomeCleanSheet": 0.35,
      "AwayCleanSheet": 0.42,
      "TotalGoalsOver1_5": 0.85,
      "TotalGoalsUnder1_5": 0.15,
      "TotalGoalsOver3_5": 0.35,
      "TotalGoalsUnder3_5": 0.65
    };

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 500));

    return NextResponse.json(mockAnalysis);
  } catch (error) {
    console.error('Error in bet analysis:', error);
    return NextResponse.json(
      { error: 'Failed to analyze bet' },
      { status: 500 }
    );
  }
}
