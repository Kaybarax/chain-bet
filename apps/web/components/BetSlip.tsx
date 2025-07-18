'use client';

import React, { useState, useEffect } from 'react';
import { useAccount, useWriteContract, useChainId, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import { SharedButton } from './SharedButton';
import { useBetSlip } from '../contexts/AppStateContext';
import { footballBettingABI, getContractAddress } from '../lib/contracts';

export const BetSlip: React.FC = () => {
  const { betSlip, totalStake, potentialWin, removeBet, updateStake, clearBetSlip } = useBetSlip();
  const [isOpen, setIsOpen] = useState(false);
  const [transactionHash, setTransactionHash] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [transactionError, setTransactionError] = useState<string | null>(null);
  
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { writeContract, isPending, error, data: hash } = useWriteContract();
  
    // Wait for transaction receipt
  const { 
    data: receipt, 
    isLoading: isConfirming, 
    isSuccess: isConfirmed, 
    isError: isConfirmError,
    error: confirmError 
  } = useWaitForTransactionReceipt({
    hash,
  });

  // Handle transaction success
  useEffect(() => {
    if (isConfirmed && hash) {
      setShowSuccess(true);
      setTransactionHash(hash);
      clearBetSlip();
      
      // Hide success message after 5 seconds
      setTimeout(() => {
        setShowSuccess(false);
        setTransactionHash(null);
      }, 5000);
    }
  }, [isConfirmed, hash, clearBetSlip]);

  // Handle transaction error
  useEffect(() => {
    if (error) {
      setTransactionError(error.message);
      setTimeout(() => setTransactionError(null), 5000);
    }
  }, [error]);

  const handleStakeChange = (selectionId: string, value: string) => {
    const stake = parseFloat(value) || 0;
    updateStake(selectionId, stake);
  };

  const handleRemoveSelection = (selectionId: string) => {
    removeBet(selectionId);
  };

  const handlePlaceBet = async () => {
    if (betSlip.length === 0 || !isConnected) return;
    
    try {
      // For MVP, we'll place the first bet in the slip
      // In a full implementation, you might want to place multiple bets or combine them
      const firstBet = betSlip[0];
      
      if (!firstBet) {
        console.error('No bets found in bet slip');
        return;
      }

      const contractAddress = getContractAddress(chainId);
      
      // Check if contract address is set (not placeholder)
      if (contractAddress === '0x0000000000000000000000000000000000000000') {
        console.log('Contract not deployed yet. Logging bet details for testing:');
        console.log('Bet Details:', {
          matchId: firstBet.matchId,
          betType: firstBet.marketType,
          prediction: firstBet.selection.name,
          odds: Math.floor(firstBet.odds * 1000), // Convert to contract format
          stakeInWei: parseEther(firstBet.stake.toString()).toString(),
          totalStake,
          potentialWin,
        });
        
        // Simulate transaction success
        alert('Bet placed successfully! (Demo mode - contract not deployed yet)');
        clearBetSlip();
        return;
      }

      // Place the bet on-chain
      writeContract({
        address: contractAddress,
        abi: footballBettingABI,
        functionName: 'placeBet',
        args: [
          firstBet.matchId,
          firstBet.marketType,
          firstBet.selection.name,
          BigInt(Math.floor(firstBet.odds * 1000)) // Convert odds to contract format
        ],
        value: parseEther(firstBet.stake.toString())
      });

      // Clear the bet slip after successful transaction
      clearBetSlip();
      
    } catch (err) {
      console.error('Error placing bet:', err);
      alert('Failed to place bet. Please try again.');
    }
  };

  const canPlaceBet = betSlip.length > 0 && totalStake > 0 && isConnected;
  const isTransactionPending = isPending || isConfirming;

  return (
    <>
      {/* Bet Slip Toggle Button */}
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <span>Bet Slip</span>
          {betSlip.length > 0 && (
            <span className="bg-blue-800 text-white px-2 py-1 rounded-full text-sm">
              {betSlip.length}
            </span>
          )}
        </button>
      </div>

      {/* Bet Slip Panel */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-96 overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Bet Slip</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
          </div>

          <div className="overflow-y-auto max-h-64">
            {betSlip.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                <p>Your bet slip is empty</p>
                <p className="text-sm mt-1">Add selections from match pages</p>
              </div>
            ) : (
              <div className="p-4 space-y-3">
                {betSlip.map((selection) => (
                  <div key={selection.id} className="border border-gray-200 rounded-lg p-3">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{selection.selection.name}</p>
                        <p className="text-xs text-gray-600">Odds: {selection.odds.toFixed(2)}</p>
                      </div>
                      <button
                        onClick={() => handleRemoveSelection(selection.id)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium">Stake:</label>
                      <input
                        type="number"
                        value={selection.stake}
                        onChange={(e) => handleStakeChange(selection.id, e.target.value)}
                        className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                      />
                      <span className="text-sm text-gray-600">ETH</span>
                    </div>
                    
                    {selection.stake > 0 && (
                      <div className="mt-2 text-sm">
                        <span className="text-gray-600">Potential win: </span>
                        <span className="font-medium text-green-600">
                          {(selection.stake * selection.odds).toFixed(4)} ETH
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {betSlip.length > 0 && (
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span>Total Stake:</span>
                  <span className="font-medium">{totalStake.toFixed(4)} ETH</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Potential Payout:</span>
                  <span className="font-medium text-green-600">
                    {potentialWin.toFixed(4)} ETH
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Potential Profit:</span>
                  <span className="font-medium text-blue-600">
                    {(potentialWin - totalStake).toFixed(4)} ETH
                  </span>
                </div>
              </div>
              
              <div className="flex gap-2">
                <SharedButton
                  variant="outline"
                  size="sm"
                  onClick={clearBetSlip}
                  className="flex-1"
                >
                  Clear All
                </SharedButton>
                <SharedButton
                  variant="primary"
                  size="sm"
                  onClick={handlePlaceBet}
                  disabled={!canPlaceBet || isTransactionPending}
                  className="flex-1"
                >
                  {isTransactionPending ? 'Placing Bet...' : 
                   !isConnected ? 'Connect Wallet' : 
                   'Place Bet'}
                </SharedButton>
              </div>
              
              {/* Transaction Status Messages */}
              {isTransactionPending && (
                <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    <span className="text-sm text-blue-800">
                      {isPending ? 'Sending transaction...' : isConfirming ? 'Confirming transaction...' : 'Processing bet...'}
                    </span>
                  </div>
                </div>
              )}
              
              {isConfirmed && (
                <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-md">
                  <div className="flex items-center gap-2">
                    <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm text-green-800">
                      Bet placed successfully!
                    </span>
                  </div>
                  {hash && (
                    <div className="mt-2 text-xs text-green-700">
                      Transaction: {hash.slice(0, 10)}...{hash.slice(-8)}
                    </div>
                  )}
                </div>
              )}
              
              {(error || isConfirmError) && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
                  <div className="flex items-center gap-2">
                    <svg className="h-4 w-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span className="text-sm text-red-800">
                      Failed to place bet
                    </span>
                  </div>
                  {(error || confirmError) && (
                    <div className="mt-2 text-xs text-red-700">
                      {error?.message || confirmError?.message || 'Unknown error occurred'}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
};
