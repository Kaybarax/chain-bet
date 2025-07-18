'use client';

// Profile page for user bets and wallet information
import { Button } from '@ui/components/button';
import { Card } from '@ui/components/card';
import Layout from '../../components/Layout';
import { useState, useEffect } from 'react';
import { Wallet, History, Trophy, TrendingUp, TrendingDown } from 'lucide-react';

interface UserBet {
  id: string;
  matchId: string;
  match: string;
  market: string;
  selection: string;
  odds: number;
  stake: number;
  potentialPayout: number;
  status: 'pending' | 'won' | 'lost';
  placedAt: string;
}

export default function Profile() {
  const [userBets, setUserBets] = useState<UserBet[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');

  // Mock user bets data
  useEffect(() => {
    const mockBets: UserBet[] = [
      {
        id: 'bet_001',
        matchId: 'match_001',
        match: 'Manchester United vs Liverpool',
        market: '1X2 Full Time',
        selection: 'Home',
        odds: 2.10,
        stake: 0.1,
        potentialPayout: 0.21,
        status: 'pending',
        placedAt: '2024-03-14T10:30:00Z'
      },
      {
        id: 'bet_002',
        matchId: 'match_002',
        match: 'Arsenal vs Chelsea',
        market: 'Both Teams To Score',
        selection: 'Yes',
        odds: 1.80,
        stake: 0.05,
        potentialPayout: 0.09,
        status: 'won',
        placedAt: '2024-03-13T14:20:00Z'
      }
    ];
    setUserBets(mockBets);
  }, []);

  const connectWallet = () => {
    // Mock wallet connection
    setIsConnected(true);
    setWalletAddress('0x1234...5678');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-50';
      case 'won': return 'text-green-600 bg-green-50';
      case 'lost': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'won': return <TrendingUp className="h-4 w-4" />;
      case 'lost': return <TrendingDown className="h-4 w-4" />;
      default: return <History className="h-4 w-4" />;
    }
  };

  const totalStaked = userBets.reduce((sum, bet) => sum + bet.stake, 0);
  const totalWon = userBets.filter(bet => bet.status === 'won').reduce((sum, bet) => sum + bet.potentialPayout, 0);
  const pendingBets = userBets.filter(bet => bet.status === 'pending').length;

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile</h1>
          <p className="text-gray-600">Manage your wallet and view your betting history</p>
        </div>

        {/* Wallet Section */}
        <Card className="p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Wallet className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-1">Wallet</h2>
                {isConnected ? (
                  <p className="text-gray-600">Connected: {walletAddress}</p>
                ) : (
                  <p className="text-gray-600">Connect your wallet to start betting</p>
                )}
              </div>
            </div>
            <Button onClick={connectWallet} disabled={isConnected}>
              {isConnected ? 'Connected' : 'Connect Wallet'}
            </Button>
          </div>
        </Card>

        {isConnected && (
          <>
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Staked</p>
                    <p className="text-2xl font-bold text-gray-900">{totalStaked.toFixed(3)} ETH</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Trophy className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Won</p>
                    <p className="text-2xl font-bold text-gray-900">{totalWon.toFixed(3)} ETH</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <History className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Pending Bets</p>
                    <p className="text-2xl font-bold text-gray-900">{pendingBets}</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Betting History */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Betting History</h2>
              
              {userBets.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No bets placed yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {userBets.map((bet) => (
                    <div key={bet.id} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-gray-900">{bet.match}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(bet.status)}`}>
                              {getStatusIcon(bet.status)}
                              {bet.status.charAt(0).toUpperCase() + bet.status.slice(1)}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <p className="text-gray-600">Market</p>
                              <p className="font-medium">{bet.market}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Selection</p>
                              <p className="font-medium">{bet.selection}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Odds</p>
                              <p className="font-medium">{bet.odds.toFixed(2)}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Stake</p>
                              <p className="font-medium">{bet.stake.toFixed(3)} ETH</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right ml-4">
                          <p className="text-sm text-gray-600">Potential Payout</p>
                          <p className="text-lg font-bold text-gray-900">{bet.potentialPayout.toFixed(3)} ETH</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(bet.placedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </>
        )}
      </div>
    </Layout>
  );
}
