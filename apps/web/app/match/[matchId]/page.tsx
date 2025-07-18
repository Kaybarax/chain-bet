'use client';

import { useState, useEffect } from 'react';
import { SharedButton } from '../../../components/SharedButton';
import { MarketGrid, MatchMarket } from '../../../components/MarketGrid';
import { MarketSelection } from '../../../components/Market';
import Link from 'next/link';

// Import the new API client factory
// import { apiClient } from '@chainbet/api-client';

// Mock match data - will be replaced with API client when working
const mockMatchData = {
  'match_001': {
    id: 'match_001',
    homeTeam: 'Manchester United',
    awayTeam: 'Liverpool',
    competition: 'Premier League',
    date: '2024-03-15T15:00:00Z',
    status: 'upcoming',
    venue: 'Old Trafford',
    referee: 'Michael Oliver',
    markets: [
      {
        id: 'market_001_1x2',
        name: '1X2 Full Time',
        type: '1X2' as const,
        selections: [
          { id: 'sel_001_home', name: 'Home', odds: 2.10, outcome: 'Home' },
          { id: 'sel_001_draw', name: 'Draw', odds: 3.40, outcome: 'Draw' },
          { id: 'sel_001_away', name: 'Away', odds: 3.20, outcome: 'Away' }
        ],
        metadata: {
          homeTeam: 'Manchester United',
          awayTeam: 'Liverpool',
          time: 'FT' as const
        }
      },
      {
        id: 'market_001_btts',
        name: 'Both Teams To Score',
        type: 'BTTS' as const,
        selections: [
          { id: 'sel_001_btts_yes', name: 'Yes', odds: 1.80, outcome: 'Yes' },
          { id: 'sel_001_btts_no', name: 'No', odds: 2.00, outcome: 'No' }
        ],
        metadata: {
          time: 'FT' as const
        }
      },
      {
        id: 'market_001_over_under',
        name: 'Over/Under 2.5 Goals',
        type: 'OVER_UNDER' as const,
        selections: [
          { id: 'sel_001_over_25', name: 'Over', odds: 1.90, outcome: 'Over' },
          { id: 'sel_001_under_25', name: 'Under', odds: 1.90, outcome: 'Under' }
        ],
        metadata: {
          line: 2.5,
          metric: 'Goals'
        }
      },
      {
        id: 'market_001_double_chance',
        name: 'Double Chance',
        type: 'DOUBLE_CHANCE' as const,
        selections: [
          { id: 'sel_001_1x', name: '1/X', odds: 1.30, outcome: '1/X' },
          { id: 'sel_001_x2', name: 'X/2', odds: 1.65, outcome: 'X/2' },
          { id: 'sel_001_12', name: '1/2', odds: 1.25, outcome: '1/2' }
        ],
        metadata: {
          homeTeam: 'Manchester United',
          awayTeam: 'Liverpool',
          time: 'FT' as const
        }
      }
    ]
  },
  'match_002': {
    id: 'match_002',
    homeTeam: 'Arsenal',
    awayTeam: 'Chelsea',
    competition: 'Premier League',
    date: '2024-03-16T17:30:00Z',
    status: 'upcoming',
    venue: 'Emirates Stadium',
    referee: 'Anthony Taylor',
    markets: [
      {
        id: 'market_002_1x2',
        name: '1X2 Full Time',
        type: '1X2' as const,
        selections: [
          { id: 'sel_002_home', name: 'Home', odds: 1.90, outcome: 'Home' },
          { id: 'sel_002_draw', name: 'Draw', odds: 3.60, outcome: 'Draw' },
          { id: 'sel_002_away', name: 'Away', odds: 4.20, outcome: 'Away' }
        ],
        metadata: {
          homeTeam: 'Arsenal',
          awayTeam: 'Chelsea',
          time: 'FT' as const
        }
      },
      {
        id: 'market_002_btts',
        name: 'Both Teams To Score',
        type: 'BTTS' as const,
        selections: [
          { id: 'sel_002_btts_yes', name: 'Yes', odds: 1.75, outcome: 'Yes' },
          { id: 'sel_002_btts_no', name: 'No', odds: 2.05, outcome: 'No' }
        ],
        metadata: {
          time: 'FT' as const
        }
      }
    ]
  }
};

export default function MatchDetailsPage({ params }: { params: { matchId: string } }) {
  const [selectedSelections, setSelectedSelections] = useState<string[]>([]);
  const [betSlip, setBetSlip] = useState<Array<MarketSelection & { marketId: string }>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [match, setMatch] = useState<any>(null);

  useEffect(() => {
    // Simulate API call
    const loadMatchData = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const matchData = mockMatchData[params.matchId as keyof typeof mockMatchData];
      setMatch(matchData);
      setIsLoading(false);
    };

    loadMatchData();
  }, [params.matchId]);

  const handleSelectionClick = (selection: MarketSelection & { marketId: string }) => {
    const selectionKey = `${selection.marketId}_${selection.id}`;
    
    if (selectedSelections.includes(selectionKey)) {
      // Remove selection
      setSelectedSelections(prev => prev.filter(s => s !== selectionKey));
      setBetSlip(prev => prev.filter(s => s.id !== selection.id));
    } else {
      // Add selection
      setSelectedSelections(prev => [...prev, selectionKey]);
      setBetSlip(prev => [...prev, selection]);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculatePotentialPayout = () => {
    if (betSlip.length === 0) return 0;
    const totalOdds = betSlip.reduce((acc, selection) => acc * selection.odds, 1);
    return totalOdds * 10; // Assuming £10 stake
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading match details...</span>
      </div>
    );
  }

  if (!match) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Match Not Found</h1>
        <p className="text-gray-600 mb-8">The match you're looking for doesn't exist.</p>
        <Link href="/">
          <SharedButton variant="primary">Back to Search</SharedButton>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Match Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <span className="text-sm font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
              {match.competition}
            </span>
            <h1 className="text-3xl font-bold text-gray-900 mt-2">
              {match.homeTeam} vs {match.awayTeam}
            </h1>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">
              {formatDate(match.date)}
            </div>
            <div className="text-sm text-gray-500 mt-1">
              {match.venue} • {match.referee}
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">Status:</span>
            <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
              {match.status.charAt(0).toUpperCase() + match.status.slice(1)}
            </span>
          </div>
          <div className="flex space-x-2">
            <Link href="/">
              <SharedButton variant="outline" size="sm">
                Back to Search
              </SharedButton>
            </Link>
            <SharedButton variant="secondary" size="sm">
              Add to Favorites
            </SharedButton>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Markets */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Betting Markets</h2>
            <MarketGrid
              markets={match.markets}
              onSelectionClick={handleSelectionClick}
              selectedSelections={selectedSelections}
            />
          </div>
        </div>

        {/* Bet Slip */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Bet Slip ({betSlip.length})
            </h3>
            
            {betSlip.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                Select betting options to add them to your bet slip
              </p>
            ) : (
              <div className="space-y-4">
                {betSlip.map((selection) => (
                  <div key={selection.id} className="p-3 border rounded-md">
                    <div className="flex justify-between items-start mb-2">
                      <div className="text-sm font-medium text-gray-900">
                        {selection.name}
                      </div>
                      <div className="text-sm font-bold text-blue-600">
                        {selection.odds.toFixed(2)}
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 mb-2">
                      {match.homeTeam} vs {match.awayTeam}
                    </div>
                    <input
                      type="number"
                      placeholder="Stake (£)"
                      className="w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      defaultValue="10"
                    />
                  </div>
                ))}
                
                <div className="border-t pt-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Total Odds:</span>
                    <span className="font-bold">
                      {betSlip.reduce((acc, sel) => acc * sel.odds, 1).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm mb-4">
                    <span>Potential Payout:</span>
                    <span className="font-bold text-green-600">
                      £{calculatePotentialPayout().toFixed(2)}
                    </span>
                  </div>
                  <SharedButton 
                    variant="primary" 
                    className="w-full"
                    disabled={betSlip.length === 0}
                  >
                    Place Bet
                  </SharedButton>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
