import { defaultWagmiConfig } from '@web3modal/wagmi/react/config';
import { cookieStorage, createStorage } from 'wagmi';
import { mainnet, polygon, polygonMumbai } from 'wagmi/chains';

// Get project ID from environment
export const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || 'demo-project-id';

const metadata = {
  name: 'ChainBet',
  description: 'Decentralized Football Betting Platform',
  url: 'https://chainbet.app',
  icons: ['https://chainbet.app/icon.png'],
};

// Create wagmi config
export const config = defaultWagmiConfig({
  chains: [mainnet, polygon, polygonMumbai],
  projectId,
  metadata,
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
});

// Define supported chains
export const chains = [mainnet, polygon, polygonMumbai];
