import { NextRequest, NextResponse } from 'next/server';
import { Bet } from '../../../../../../packages/types/database';

// Mock user bets data
const mockUserBets: Bet[] = [
  {
    betId: 'bet_001',
    walletAddress: '0x1234567890abcdef1234567890abcdef12345678',
    matchId: 'match_001',
    marketId: 'market_001_1x2',
    selectionId: 'sel_001_home',
    stake: 0.1,
    potentialPayout: 0.21,
    odds: 2.10,
    status: 'pending',
    placedAt: new Date('2024-03-14T10:30:00Z'),
    txHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890'
  },
  {
    betId: 'bet_002',
    walletAddress: '0x1234567890abcdef1234567890abcdef12345678',
    matchId: 'match_002',
    marketId: 'market_002_btts',
    selectionId: 'sel_002_btts_yes',
    stake: 0.05,
    potentialPayout: 0.0825,
    odds: 1.65,
    status: 'won',
    placedAt: new Date('2024-03-13T14:20:00Z'),
    settledAt: new Date('2024-03-13T22:00:00Z'),
    txHash: '0xfedcba0987654321fedcba0987654321fedcba0987654321fedcba0987654321'
  },
  {
    betId: 'bet_003',
    walletAddress: '0x1234567890abcdef1234567890abcdef12345678',
    matchId: 'match_003',
    marketId: 'market_003_total',
    selectionId: 'sel_003_over',
    stake: 0.08,
    potentialPayout: 0.152,
    odds: 1.90,
    status: 'pending',
    placedAt: new Date('2024-03-14T16:45:00Z'),
    txHash: '0x1122334455667788990011223344556677889900112233445566778899001122'
  },
  {
    betId: 'bet_004',
    walletAddress: '0x9876543210fedcba9876543210fedcba98765432',
    matchId: 'match_001',
    marketId: 'market_001_btts',
    selectionId: 'sel_001_btts_no',
    stake: 0.15,
    potentialPayout: 0.3225,
    odds: 2.15,
    status: 'won',
    placedAt: new Date('2024-03-12T09:15:00Z'),
    settledAt: new Date('2024-03-12T17:00:00Z'),
    txHash: '0x9988776655443322110099887766554433221100998877665544332211009988'
  }
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const walletAddress = searchParams.get('walletAddress');
  
  if (!walletAddress) {
    return NextResponse.json(
      { error: 'walletAddress query parameter is required' },
      { status: 400 }
    );
  }

  // Filter bets by wallet address
  const userBets = mockUserBets.filter(bet => 
    bet.walletAddress.toLowerCase() === walletAddress.toLowerCase()
  );

  return NextResponse.json({
    bets: userBets,
    total: userBets.length
  });
}
