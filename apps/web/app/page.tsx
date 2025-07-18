'use client';

import { useState, useEffect } from 'react';
import { SharedButton } from '../components/SharedButton';
import Link from 'next/link';

// Import the new API client factory
// import { apiClient } from '@chainbet/api-client';

// Temporary mock data - will be replaced with API client when working
const mockMatches = [
  {
    id: 'match_001',
    homeTeam: 'Manchester United',
    awayTeam: 'Liverpool',
    competition: 'Premier League',
    date: '2024-03-15T15:00:00Z',
    status: 'upcoming',
    markets: [
      { id: 'market_001_1x2', name: '1X2 Full Time' },
      { id: 'market_001_btts', name: 'Both Teams To Score' }
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
      { id: 'market_002_1x2', name: '1X2 Full Time' }
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
      { id: 'market_003_1x2', name: '1X2 Full Time' }
    ]
  }
];

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [matches, setMatches] = useState(mockMatches);
  const [filteredMatches, setFilteredMatches] = useState(mockMatches);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    setIsLoading(true);
    setHasSearched(true);
    setError(null);
    
    try {
      // TODO: Replace with actual API call when backend is ready
      // const results = await apiClient.getMatches(searchQuery);
      // setFilteredMatches(results);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock search logic
      if (!searchQuery.trim()) {
        setFilteredMatches(matches);
      } else {
        const filtered = matches.filter(match => 
          match.homeTeam.toLowerCase().includes(searchQuery.toLowerCase()) ||
          match.awayTeam.toLowerCase().includes(searchQuery.toLowerCase()) ||
          match.competition.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredMatches(filtered);
      }
    } catch (err) {
      setError('Failed to search matches. Please try again.');
      console.error('Search error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Load all matches on initial load
  useEffect(() => {
    const loadInitialMatches = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // TODO: Replace with actual API call when backend is ready
        // const results = await apiClient.getMatches('');
        // setMatches(results);
        // setFilteredMatches(results);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        setFilteredMatches(matches);
      } catch (err) {
        setError('Failed to load matches. Please try again.');
        console.error('Load error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialMatches();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header Section */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Find Football Matches</h1>
        <p className="text-lg text-gray-600 mb-8">Search and bet on upcoming football matches</p>
      </div>

      {/* Search Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search teams, competitions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isLoading}
            />
          </div>
          <SharedButton 
            variant="primary" 
            onClick={handleSearch}
            disabled={isLoading}
          >
            {isLoading ? 'Searching...' : 'Search Matches'}
          </SharedButton>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
          <div className="flex">
            <div className="text-red-600 text-sm">{error}</div>
            <button 
              onClick={() => setError(null)}
              className="ml-auto text-red-600 hover:text-red-800"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Results Section */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading matches...</p>
          </div>
        ) : filteredMatches.length === 0 ? (
          hasSearched && (
            <div className="text-center py-8">
              <p className="text-gray-600">No matches found for "{searchQuery}"</p>
              <SharedButton 
                variant="outline" 
                onClick={() => {
                  setSearchQuery('');
                  setFilteredMatches(matches);
                  setHasSearched(false);
                }}
                className="mt-4"
              >
                Clear Search
              </SharedButton>
            </div>
          )
        ) : (
          filteredMatches.map((match) => (
            <div key={match.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                <div className="flex-1 mb-4 sm:mb-0">
                  <div className="flex items-center space-x-4 mb-2">
                    <span className="text-sm font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                      {match.competition}
                    </span>
                    <span className="text-sm text-gray-500">
                      {formatDate(match.date)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-lg font-semibold text-gray-900">
                      {match.homeTeam}
                    </div>
                    <div className="text-gray-400">vs</div>
                    <div className="text-lg font-semibold text-gray-900">
                      {match.awayTeam}
                    </div>
                  </div>
                  <div className="mt-2">
                    <span className="text-sm text-gray-600">
                      {match.markets.length} betting markets available
                    </span>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Link href={`/match/${match.id}`}>
                    <SharedButton variant="primary">
                      View Markets
                    </SharedButton>
                  </Link>
                  <SharedButton variant="outline">
                    Quick Bet
                  </SharedButton>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
