// FED2T2S_StateManagement: Global state management with React Context
'use client';

import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { useAccount, useConnect } from 'wagmi';
import { MarketSelection } from '../components/Market';

// Types for the global state
export interface BetSlipItem {
  id: string;
  matchId: string;
  marketType: string;
  selection: MarketSelection;
  odds: number;
  stake: number;
  homeTeam: string;
  awayTeam: string;
  matchDate: string;
}

export interface AppState {
  betSlip: BetSlipItem[];
  totalStake: number;
  potentialWin: number;
  isWalletConnected: boolean;
  walletAddress: string | null;
}

export type AppAction = 
  | { type: 'ADD_BET'; payload: BetSlipItem }
  | { type: 'REMOVE_BET'; payload: string }
  | { type: 'UPDATE_STAKE'; payload: { id: string; stake: number } }
  | { type: 'CLEAR_BETSLIP' }
  | { type: 'SET_WALLET_CONNECTION'; payload: { isConnected: boolean; address: string | null } };

// Initial state
const initialState: AppState = {
  betSlip: [],
  totalStake: 0,
  potentialWin: 0,
  isWalletConnected: false,
  walletAddress: null,
};

// Reducer function
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'ADD_BET':
      const newBetSlip = [...state.betSlip, action.payload];
      return {
        ...state,
        betSlip: newBetSlip,
        totalStake: newBetSlip.reduce((sum, bet) => sum + bet.stake, 0),
        potentialWin: newBetSlip.reduce((sum, bet) => sum + (bet.stake * bet.odds), 0),
      };
    
    case 'REMOVE_BET':
      const filteredBetSlip = state.betSlip.filter(bet => bet.id !== action.payload);
      return {
        ...state,
        betSlip: filteredBetSlip,
        totalStake: filteredBetSlip.reduce((sum, bet) => sum + bet.stake, 0),
        potentialWin: filteredBetSlip.reduce((sum, bet) => sum + (bet.stake * bet.odds), 0),
      };
    
    case 'UPDATE_STAKE':
      const updatedBetSlip = state.betSlip.map(bet => 
        bet.id === action.payload.id 
          ? { ...bet, stake: action.payload.stake }
          : bet
      );
      return {
        ...state,
        betSlip: updatedBetSlip,
        totalStake: updatedBetSlip.reduce((sum, bet) => sum + bet.stake, 0),
        potentialWin: updatedBetSlip.reduce((sum, bet) => sum + (bet.stake * bet.odds), 0),
      };
    
    case 'CLEAR_BETSLIP':
      return {
        ...state,
        betSlip: [],
        totalStake: 0,
        potentialWin: 0,
      };
    
    case 'SET_WALLET_CONNECTION':
      return {
        ...state,
        isWalletConnected: action.payload.isConnected,
        walletAddress: action.payload.address,
      };
    
    default:
      return state;
  }
}

// Context
const AppStateContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | undefined>(undefined);

// Provider component
export function AppStateProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const { isConnected, address } = useAccount();

  // Update wallet connection state when wagmi state changes
  useEffect(() => {
    dispatch({
      type: 'SET_WALLET_CONNECTION',
      payload: { isConnected, address: address || null }
    });
  }, [isConnected, address]);

  return (
    <AppStateContext.Provider value={{ state, dispatch }}>
      {children}
    </AppStateContext.Provider>
  );
}

// Custom hook to use the context
export function useAppState() {
  const context = useContext(AppStateContext);
  if (context === undefined) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
}

// Convenience hooks
export function useBetSlip() {
  const { state, dispatch } = useAppState();
  
  const addBet = (bet: BetSlipItem) => {
    dispatch({ type: 'ADD_BET', payload: bet });
  };
  
  const removeBet = (id: string) => {
    dispatch({ type: 'REMOVE_BET', payload: id });
  };
  
  const updateStake = (id: string, stake: number) => {
    dispatch({ type: 'UPDATE_STAKE', payload: { id, stake } });
  };
  
  const clearBetSlip = () => {
    dispatch({ type: 'CLEAR_BETSLIP' });
  };
  
  return {
    betSlip: state.betSlip,
    totalStake: state.totalStake,
    potentialWin: state.potentialWin,
    addBet,
    removeBet,
    updateStake,
    clearBetSlip,
  };
}

export function useWallet() {
  const { state } = useAppState();
  return {
    isConnected: state.isWalletConnected,
    address: state.walletAddress,
  };
}
