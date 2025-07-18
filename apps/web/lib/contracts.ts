import { type Address } from 'viem'

// Contract ABI - extracted from compiled contract
export const footballBettingABI = [
  {
    inputs: [
      { internalType: 'string', name: 'matchId', type: 'string' },
      { internalType: 'string', name: 'betType', type: 'string' },
      { internalType: 'string', name: 'prediction', type: 'string' },
      { internalType: 'uint256', name: 'odds', type: 'uint256' }
    ],
    name: 'placeBet',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'payable',
    type: 'function'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'uint256', name: 'id', type: 'uint256' },
      { indexed: false, internalType: 'string', name: 'matchId', type: 'string' },
      { indexed: true, internalType: 'address', name: 'bettor', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' }
    ],
    name: 'BetPlaced',
    type: 'event'
  },
  {
    inputs: [],
    name: 'getAllBets',
    outputs: [
      {
        components: [
          { internalType: 'uint256', name: 'id', type: 'uint256' },
          { internalType: 'string', name: 'matchId', type: 'string' },
          { internalType: 'string', name: 'betType', type: 'string' },
          { internalType: 'string', name: 'prediction', type: 'string' },
          { internalType: 'uint256', name: 'amount', type: 'uint256' },
          { internalType: 'uint256', name: 'odds', type: 'uint256' },
          { internalType: 'bool', name: 'settled', type: 'bool' },
          { internalType: 'bool', name: 'won', type: 'bool' },
          { internalType: 'uint256', name: 'createdAt', type: 'uint256' },
          { internalType: 'uint256', name: 'settledAt', type: 'uint256' }
        ],
        internalType: 'struct FootballBetting.Bet[]',
        name: '',
        type: 'tuple[]'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'id', type: 'uint256' }
    ],
    name: 'getBet',
    outputs: [
      {
        components: [
          { internalType: 'uint256', name: 'id', type: 'uint256' },
          { internalType: 'string', name: 'matchId', type: 'string' },
          { internalType: 'string', name: 'betType', type: 'string' },
          { internalType: 'string', name: 'prediction', type: 'string' },
          { internalType: 'uint256', name: 'amount', type: 'uint256' },
          { internalType: 'uint256', name: 'odds', type: 'uint256' },
          { internalType: 'bool', name: 'settled', type: 'bool' },
          { internalType: 'bool', name: 'won', type: 'bool' },
          { internalType: 'uint256', name: 'createdAt', type: 'uint256' },
          { internalType: 'uint256', name: 'settledAt', type: 'uint256' }
        ],
        internalType: 'struct FootballBetting.Bet',
        name: '',
        type: 'tuple'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  }
] as const

// Contract addresses by chain
export const CONTRACT_ADDRESSES = {
  // Local development
  31337: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512', // Hardhat local network
  // Testnet
  11155111: '0x0000000000000000000000000000000000000000', // Sepolia
  // Mainnet
  1: '0x0000000000000000000000000000000000000000', // Ethereum mainnet
} as const;

// Helper function to get contract address for current chain
export function getContractAddress(chainId: number): Address {
  switch (chainId) {
    case 31337: // Hardhat local
      return CONTRACT_ADDRESSES[31337]
    case 11155111: // Sepolia
      return CONTRACT_ADDRESSES[11155111]
    case 1: // Mainnet
      return CONTRACT_ADDRESSES[1]
    default:
      return CONTRACT_ADDRESSES[31337] // Default to local development
  }
}
