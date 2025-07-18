'use client';

import { useAccount } from 'wagmi';
import { useEffect, useState } from 'react';
import { formatEther } from 'viem';
import { SharedButton } from '../../components/SharedButton';
import Link from 'next/link';

// Type definitions for bet history
interface BetHistoryItem {
  id: string;
  matchId: string;
  betType: string;
  prediction: string;
  odds: number;
  stake: number;
  potentialWin: number;
  status: 'pending' | 'won' | 'lost';
  timestamp: number;
  transactionHash: string;
  blockNumber?: number;
}

// Mock data for demonstration (in production, this would come from on-chain events or API)
const mockBetHistory: BetHistoryItem[] = [
  {
    id: '1',
    matchId: 'match-1',
    betType: 'Match Result',
    prediction: 'Manchester United',
    odds: 2.5,
    stake: 0.1,
    potentialWin: 0.25,
    status: 'pending',
    timestamp: Date.now() - 1000 * 60 * 30, // 30 minutes ago
    transactionHash: '0x1234567890abcdef1234567890abcdef12345678',
    blockNumber: 12345
  },
  {
    id: '2',
    matchId: 'match-2',
    betType: 'Over/Under',
    prediction: 'Over 2.5',
    odds: 1.8,
    stake: 0.05,
    potentialWin: 0.09,
    status: 'won',
    timestamp: Date.now() - 1000 * 60 * 60 * 24, // 1 day ago
    transactionHash: '0xabcdef1234567890abcdef1234567890abcdef12',
    blockNumber: 12340
  },
  {
    id: '3',
    matchId: 'match-3',
    betType: 'Match Result',
    prediction: 'Liverpool',
    odds: 3.2,
    stake: 0.08,
    potentialWin: 0.256,
    status: 'lost',
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 2, // 2 days ago
    transactionHash: '0x567890abcdef1234567890abcdef1234567890ab',
    blockNumber: 12335
  }
];

export default function ProfilePage() {
  const { address, isConnected } = useAccount();
  const [betHistory, setBetHistory] = useState<BetHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalBets: 0,
    totalStaked: 0,
    totalWon: 0,
    winRate: 0,
    profit: 0
  });

  // Simulate loading bet history
  useEffect(() => {
    if (isConnected) {
      // In production, this would fetch from blockchain events or API
      setTimeout(() => {
        setBetHistory(mockBetHistory);
        setIsLoading(false);
      }, 1000);
    }
  }, [isConnected]);

  // Calculate stats
  useEffect(() => {
    if (betHistory.length > 0) {
      const totalBets = betHistory.length;
      const totalStaked = betHistory.reduce((sum, bet) => sum + bet.stake, 0);
      const wonBets = betHistory.filter(bet => bet.status === 'won');
      const totalWon = wonBets.reduce((sum, bet) => sum + bet.potentialWin, 0);
      const winRate = (wonBets.length / totalBets) * 100;
      const profit = totalWon - totalStaked;

      setStats({
        totalBets,
        totalStaked,
        totalWon,
        winRate,
        profit
      });
    }
  }, [betHistory]);

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const getStatusColor = (status: BetHistoryItem['status']) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'won':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'lost':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: BetHistoryItem['status']) => {
    switch (status) {
      case 'pending':
        return (
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-600"></div>
        );
      case 'won':
        return (
          <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'lost':
        return (
          <svg className="h-4 w-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      default:
        return null;
    }
  };

  if (!isConnected) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">Profile</h1>
          <div className="bg-gray-50 p-8 rounded-lg">
            <p className="text-gray-600 mb-4">
              Please connect your wallet to view your betting history.
            </p>
            <Link href="/">
              <SharedButton variant="primary">
                Back to Home
              </SharedButton>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Betting Profile</h1>
          <p className="text-gray-600">
            Connected wallet: {address?.slice(0, 6)}...{address?.slice(-4)}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="text-sm text-gray-600 mb-1">Total Bets</div>
            <div className="text-2xl font-bold text-gray-900">{stats.totalBets}</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="text-sm text-gray-600 mb-1">Total Staked</div>
            <div className="text-2xl font-bold text-gray-900">{stats.totalStaked.toFixed(4)} ETH</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="text-sm text-gray-600 mb-1">Total Won</div>
            <div className="text-2xl font-bold text-green-600">{stats.totalWon.toFixed(4)} ETH</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="text-sm text-gray-600 mb-1">Win Rate</div>
            <div className="text-2xl font-bold text-blue-600">{stats.winRate.toFixed(1)}%</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="text-sm text-gray-600 mb-1">Profit/Loss</div>
            <div className={`text-2xl font-bold ${stats.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {stats.profit >= 0 ? '+' : ''}{stats.profit.toFixed(4)} ETH
            </div>
          </div>
        </div>

        {/* Betting History */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold">Betting History</h2>
          </div>
          
          <div className="p-6">
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-gray-600">Loading betting history...</span>
              </div>
            ) : betHistory.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">No betting history found.</p>
                <Link href="/">
                  <SharedButton variant="primary">
                    Place Your First Bet
                  </SharedButton>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {betHistory.map((bet) => (
                  <div key={bet.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className={`flex items-center gap-2 px-2 py-1 rounded-full border text-sm font-medium ${getStatusColor(bet.status)}`}>
                            {getStatusIcon(bet.status)}
                            <span className="capitalize">{bet.status}</span>
                          </div>
                          <span className="text-sm text-gray-600">{formatTimestamp(bet.timestamp)}</span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-3">
                          <div>
                            <div className="text-sm text-gray-600">Market</div>
                            <div className="font-medium">{bet.betType}</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-600">Prediction</div>
                            <div className="font-medium">{bet.prediction}</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-600">Odds</div>
                            <div className="font-medium">{bet.odds.toFixed(2)}</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-600">Stake</div>
                            <div className="font-medium">{bet.stake.toFixed(4)} ETH</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-600">
                              Potential Win: <span className="font-medium text-green-600">{bet.potentialWin.toFixed(4)} ETH</span>
                            </span>
                            {bet.status === 'won' && (
                              <span className="text-sm text-green-600 font-medium">
                                Won: +{bet.potentialWin.toFixed(4)} ETH
                              </span>
                            )}
                            {bet.status === 'lost' && (
                              <span className="text-sm text-red-600 font-medium">
                                Lost: -{bet.stake.toFixed(4)} ETH
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-gray-500">
                            <a
                              href={`https://etherscan.io/tx/${bet.transactionHash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:text-blue-600 underline"
                            >
                              View Transaction
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-8 text-center">
          <Link href="/">
            <SharedButton variant="outline">
              Back to Betting
            </SharedButton>
          </Link>
        </div>
      </div>
    </div>
  );
}
