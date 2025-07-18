import { FastifyInstance } from 'fastify';
import { Static, Type } from '@sinclair/typebox';

// Schema for bet history query parameters
const BetHistoryQuerySchema = Type.Object({
  walletAddress: Type.String({ description: 'Wallet address of the user' }),
  limit: Type.Optional(Type.Number({ default: 50, minimum: 1, maximum: 100 })),
  offset: Type.Optional(Type.Number({ default: 0, minimum: 0 })),
  status: Type.Optional(Type.Union([
    Type.Literal('pending'),
    Type.Literal('won'),
    Type.Literal('lost'),
    Type.Literal('all')
  ], { default: 'all' }))
});

// Schema for bet history response
const BetHistoryItemSchema = Type.Object({
  id: Type.String(),
  matchId: Type.String(),
  betType: Type.String(),
  prediction: Type.String(),
  odds: Type.Number(),
  stake: Type.Number(),
  potentialWin: Type.Number(),
  status: Type.Union([
    Type.Literal('pending'),
    Type.Literal('won'),
    Type.Literal('lost')
  ]),
  timestamp: Type.Number(),
  transactionHash: Type.String(),
  blockNumber: Type.Optional(Type.Number())
});

const BetHistoryResponseSchema = Type.Object({
  bets: Type.Array(BetHistoryItemSchema),
  total: Type.Number(),
  hasMore: Type.Boolean()
});

// Mock bet history data
const mockBetHistoryData = [
  {
    id: '1',
    matchId: 'match-1',
    betType: 'Match Result',
    prediction: 'Manchester United',
    odds: 2.5,
    stake: 0.1,
    potentialWin: 0.25,
    status: 'pending' as const,
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
    status: 'won' as const,
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
    status: 'lost' as const,
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 2, // 2 days ago
    transactionHash: '0x567890abcdef1234567890abcdef1234567890ab',
    blockNumber: 12335
  },
  {
    id: '4',
    matchId: 'match-4',
    betType: 'Both Teams To Score',
    prediction: 'Yes',
    odds: 1.9,
    stake: 0.12,
    potentialWin: 0.228,
    status: 'won' as const,
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 3, // 3 days ago
    transactionHash: '0x789012345678901234567890123456789012345',
    blockNumber: 12330
  },
  {
    id: '5',
    matchId: 'match-5',
    betType: 'Double Chance',
    prediction: '1X',
    odds: 1.4,
    stake: 0.2,
    potentialWin: 0.28,
    status: 'lost' as const,
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 5, // 5 days ago
    transactionHash: '0x901234567890123456789012345678901234567',
    blockNumber: 12320
  }
];

type BetHistoryQuery = Static<typeof BetHistoryQuerySchema>;
type BetHistoryResponse = Static<typeof BetHistoryResponseSchema>;

export async function userBetRoutes(fastify: FastifyInstance) {
  // Get user bet history
  fastify.get<{ Querystring: BetHistoryQuery }>('/user/bets', {
    schema: {
      description: 'Get user bet history',
      querystring: BetHistoryQuerySchema,
      response: {
        200: BetHistoryResponseSchema,
        400: {
          type: 'object',
          properties: {
            error: { type: 'string' },
            message: { type: 'string' }
          }
        }
      }
    },
    handler: async (request, reply) => {
      const { walletAddress, limit = 50, offset = 0, status = 'all' } = request.query;
      
      // Validate wallet address format
      if (!walletAddress || !walletAddress.startsWith('0x') || walletAddress.length !== 42) {
        return reply.status(400).send({
          error: 'INVALID_WALLET_ADDRESS',
          message: 'Wallet address must be a valid Ethereum address'
        });
      }

      // In a real implementation, this would query the database
      // For demo purposes, we'll use mock data
      let filteredBets = mockBetHistoryData;

      // Filter by status if specified
      if (status !== 'all') {
        filteredBets = filteredBets.filter(bet => bet.status === status);
      }

      // Apply pagination
      const startIndex = offset;
      const endIndex = offset + limit;
      const paginatedBets = filteredBets.slice(startIndex, endIndex);

      const response: BetHistoryResponse = {
        bets: paginatedBets,
        total: filteredBets.length,
        hasMore: endIndex < filteredBets.length
      };

      return reply.send(response);
    }
  });

  // Get user bet statistics
  fastify.get<{ Querystring: { walletAddress: string } }>('/user/stats', {
    schema: {
      description: 'Get user betting statistics',
      querystring: Type.Object({
        walletAddress: Type.String({ description: 'Wallet address of the user' })
      }),
      response: {
        200: Type.Object({
          totalBets: Type.Number(),
          totalStaked: Type.Number(),
          totalWon: Type.Number(),
          winRate: Type.Number(),
          profit: Type.Number(),
          pendingBets: Type.Number()
        })
      }
    },
    handler: async (request, reply) => {
      const { walletAddress } = request.query;
      
      // Validate wallet address format
      if (!walletAddress || !walletAddress.startsWith('0x') || walletAddress.length !== 42) {
        return reply.status(400).send({
          error: 'INVALID_WALLET_ADDRESS',
          message: 'Wallet address must be a valid Ethereum address'
        });
      }

      // Calculate statistics from mock data
      const totalBets = mockBetHistoryData.length;
      const totalStaked = mockBetHistoryData.reduce((sum, bet) => sum + bet.stake, 0);
      const wonBets = mockBetHistoryData.filter(bet => bet.status === 'won');
      const totalWon = wonBets.reduce((sum, bet) => sum + bet.potentialWin, 0);
      const winRate = totalBets > 0 ? (wonBets.length / totalBets) * 100 : 0;
      const profit = totalWon - totalStaked;
      const pendingBets = mockBetHistoryData.filter(bet => bet.status === 'pending').length;

      return reply.send({
        totalBets,
        totalStaked,
        totalWon,
        winRate,
        profit,
        pendingBets
      });
    }
  });
}
