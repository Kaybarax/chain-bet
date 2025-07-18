'use client';

// FED1T6W_MatchSearchScreen: Main search page with match listings
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import Layout from '../components/Layout';
import { useState, useEffect } from 'react';
import Link from 'next/link';

// Mock data directly in component for Day 1 implementation
interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  competition: string;
  date: string;
  status: 'upcoming' | 'live' | 'finished';
  odds: { home: number; draw: number; away: number };
}

const mockMatches: Match[] = [
  {
    id: 'match_001',
    homeTeam: 'Manchester United',
    awayTeam: 'Liverpool',
    competition: 'Premier League',
    date: '2024-03-15T15:00:00Z',
    status: 'upcoming',
    odds: { home: 2.10, draw: 3.40, away: 3.20 }
  },
  {
    id: 'match_002',
    homeTeam: 'Arsenal',
    awayTeam: 'Chelsea',
    competition: 'Premier League',
    date: '2024-03-16T17:30:00Z',
    status: 'upcoming',
    odds: { home: 1.90, draw: 3.60, away: 4.20 }
  },
  {
    id: 'match_003',
    homeTeam: 'Real Madrid',
    awayTeam: 'Barcelona',
    competition: 'La Liga',
    date: '2024-03-17T20:00:00Z',
    status: 'upcoming',
    odds: { home: 2.50, draw: 3.20, away: 2.80 }
  }
];

export default function Home() {
  const [matches, setMatches] = useState<Match[]>(mockMatches);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    setIsLoading(true);
    
    // Mock API delay
    setTimeout(() => {
      if (!searchQuery.trim()) {
        setMatches(mockMatches);
      } else {
        const filteredMatches = mockMatches.filter(match => 
          match.homeTeam.toLowerCase().includes(searchQuery.toLowerCase()) ||
          match.awayTeam.toLowerCase().includes(searchQuery.toLowerCase()) ||
          match.competition.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setMatches(filteredMatches);
      }
      setIsLoading(false);
    }, 500);
  };

  const handleKeyPress = (e: any) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            ChainBet - Football Betting
          </h1>
          <p className="text-lg text-gray-600">
            Search for matches and place your bets on the blockchain
          </p>
        </div>

        {/* Search Section */}
        <Card className="p-6 mb-8">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Input
                className="pl-10"
                placeholder="Search for teams, competitions..."
                value={searchQuery}
                onChange={(e: any) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
              />
            </div>
            <Button onClick={handleSearch} disabled={isLoading}>
              {isLoading ? 'Searching...' : 'Search'}
            </Button>
          </div>
        </Card>

        {/* Matches Section */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading matches...</p>
            </div>
          ) : matches.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-gray-600">No matches found. Try a different search term.</p>
            </Card>
          ) : (
            matches.map((match) => (
              <Card key={match.id} className="p-6 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-medium text-orange-600">
                        {match.competition}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-lg font-semibold text-gray-900">
                        {match.homeTeam} vs {match.awayTeam}
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(match.date).toLocaleDateString()}
                      </div>
                    </div>

                    {/* Quick odds preview */}
                    <div className="flex gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-xs text-gray-500 mb-1">Home</div>
                        <div className="bg-blue-50 px-3 py-1 rounded text-sm font-medium text-blue-700">
                          {match.odds.home.toFixed(2)}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-gray-500 mb-1">Draw</div>
                        <div className="bg-blue-50 px-3 py-1 rounded text-sm font-medium text-blue-700">
                          {match.odds.draw.toFixed(2)}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-gray-500 mb-1">Away</div>
                        <div className="bg-blue-50 px-3 py-1 rounded text-sm font-medium text-blue-700">
                          {match.odds.away.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="ml-4">
                    <Link href={`/match/${match.id}`}>
                      <Button variant="outline">
                        View Markets
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
}
