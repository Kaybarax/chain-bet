'use client';

// FED1T9W_MatchDetailsScreen: Match details page with betting markets
import { Button } from '@ui/components/button';
import { Card } from '@ui/components/card';
import Layout from '../../../components/Layout';
import { useState, useEffect } from 'react';
import { mockApiClient, Match, Selection } from '@chainbet/api-client';
import { useParams } from 'next/navigation';
import { Calendar, Trophy, TrendingUp, Users, Target } from 'lucide-react';

export default function MatchDetails() {
  const params = useParams();
  const matchId = params.matchId as string;
  
  const [match, setMatch] = useState<Match | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBets, setSelectedBets] = useState<Selection[]>([]);

  useEffect(() => {
    loadMatchDetails();
  }, [matchId]);

  const loadMatchDetails = async () => {
    setIsLoading(true);
    try {
      const matchData = await mockApiClient.getMatchById(matchId);
      setMatch(matchData);
    } catch (error) {
      console.error('Error loading match details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectionClick = (selection: Selection) => {
    setSelectedBets(prev => {
      const exists = prev.find(bet => bet.id === selection.id);
      if (exists) {
        return prev.filter(bet => bet.id !== selection.id);
      } else {
        return [...prev, selection];
      }
    });
  };

  const isSelected = (selectionId: string) => {
    return selectedBets.some(bet => bet.id === selectionId);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading match details...</p>
        </div>
      </Layout>
    );
  }

  if (!match) {
    return (
      <Layout>
        <div className="text-center py-16">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Match not found</h1>
          <p className="text-gray-600">The match you're looking for doesn't exist.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        {/* Match Header */}
        <Card className="p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="h-5 w-5 text-orange-500" />
                <span className="text-sm font-medium text-orange-600">
                  {match.competition}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {match.homeTeam} vs {match.awayTeam}
              </h1>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(match.date).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-1">
                  <div className={`w-3 h-3 rounded-full ${
                    match.status === 'upcoming' ? 'bg-green-500' : 
                    match.status === 'live' ? 'bg-red-500' : 'bg-gray-500'
                  }`}></div>
                  {match.status.charAt(0).toUpperCase() + match.status.slice(1)}
                </div>
              </div>
            </div>
            <div className="text-right">
              <Button variant="outline" className="mb-2">
                <TrendingUp className="h-4 w-4 mr-2" />
                AI Analysis
              </Button>
              <div className="text-sm text-gray-500">
                {selectedBets.length} selection(s)
              </div>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Markets */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Betting Markets</h2>
            <div className="space-y-6">
              {match.markets.map((market) => (
                <Card key={market.id} className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Target className="h-5 w-5 text-blue-500" />
                    <h3 className="text-lg font-semibold text-gray-900">
                      {market.name}
                    </h3>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {market.selections.map((selection) => (
                      <button
                        key={selection.id}
                        onClick={() => handleSelectionClick(selection)}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          isSelected(selection.id)
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className="text-sm font-medium mb-1">
                          {selection.name}
                        </div>
                        <div className="text-lg font-bold">
                          {selection.odds.toFixed(2)}
                        </div>
                      </button>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Bet Slip */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-8">
              <div className="flex items-center gap-2 mb-4">
                <Users className="h-5 w-5 text-green-500" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Bet Slip
                </h3>
              </div>
              
              {selectedBets.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">
                    Select markets to add to your bet slip
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {selectedBets.map((bet) => (
                    <div key={bet.id} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div className="text-sm font-medium">
                          {bet.name}
                        </div>
                        <button
                          onClick={() => handleSelectionClick(bet)}
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                      <div className="text-lg font-bold text-blue-600 mb-2">
                        {bet.odds.toFixed(2)}
                      </div>
                      <input
                        type="number"
                        placeholder="Stake (ETH)"
                        className="w-full p-2 border rounded text-sm"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  ))}
                  
                  <div className="border-t pt-4">
                    <div className="text-sm text-gray-600 mb-2">
                      Total Stake: 0.00 ETH
                    </div>
                    <div className="text-sm font-medium mb-4">
                      Potential Payout: 0.00 ETH
                    </div>
                    <Button className="w-full" disabled>
                      Place Bet (Connect Wallet)
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
