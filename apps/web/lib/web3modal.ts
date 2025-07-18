'use client';

import { createWeb3Modal } from '@web3modal/wagmi/react';
import { http, createConfig } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';
import { walletConnect, injected, coinbaseWallet } from 'wagmi/connectors';

// 1. Define chains
const chains = [mainnet, sepolia] as const;

// 2. Create wagmi config
const config = createConfig({
  chains,
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
  connectors: [
    walletConnect({
      projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'demo-project-id',
    }),
    injected(),
    coinbaseWallet({ appName: 'ChainBet' }),
  ],
});

// 3. Create Web3Modal
createWeb3Modal({
  wagmiConfig: config,
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'demo-project-id',
  enableAnalytics: true,
  enableOnramp: true,
  themeMode: 'light',
  themeVariables: {
    '--w3m-accent': '#2563eb',
    '--w3m-border-radius-master': '6px',
  },
});

export { config };
