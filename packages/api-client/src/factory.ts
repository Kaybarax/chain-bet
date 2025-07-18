// API Client Factory - allows switching between mock and live clients
import { mockApiClient } from './mock';
import { liveApiClient } from './live';

export type ApiClientType = 'mock' | 'live';

export interface ApiClientInterface {
  getMatches(query?: string): Promise<any[]>;
  getMatchById(matchId: string): Promise<any | null>;
  getMarkets(matchId: string): Promise<any[]>;
  analyzeBet(matchId: string, selections: any[]): Promise<any>;
  placeBet?(betData: any): Promise<any>;
  getUserBets?(userAddress: string): Promise<any[]>;
  healthCheck?(): Promise<boolean>;
}

class ApiClientFactory {
  private currentClient: ApiClientInterface = mockApiClient;
  private clientType: ApiClientType = 'mock';

  async switchToLive(): Promise<boolean> {
    try {
      // Check if live API is available
      const isLiveAvailable = await liveApiClient.healthCheck();
      
      if (isLiveAvailable) {
        this.currentClient = liveApiClient;
        this.clientType = 'live';
        console.log('Switched to live API client');
        return true;
      } else {
        console.warn('Live API not available, staying with mock client');
        return false;
      }
    } catch (error) {
      console.error('Failed to switch to live API:', error);
      return false;
    }
  }

  switchToMock(): void {
    this.currentClient = mockApiClient;
    this.clientType = 'mock';
    console.log('Switched to mock API client');
  }

  getCurrentClientType(): ApiClientType {
    return this.clientType;
  }

  getClient(): ApiClientInterface {
    return this.currentClient;
  }

  // Proxy methods to current client
  async getMatches(query?: string) {
    return this.currentClient.getMatches(query);
  }

  async getMatchById(matchId: string) {
    return this.currentClient.getMatchById(matchId);
  }

  async getMarkets(matchId: string) {
    return this.currentClient.getMarkets(matchId);
  }

  async analyzeBet(matchId: string, selections: any[]) {
    return this.currentClient.analyzeBet(matchId, selections);
  }

  async placeBet(betData: any) {
    if (this.currentClient.placeBet) {
      return this.currentClient.placeBet(betData);
    }
    throw new Error('Place bet not available in current client');
  }

  async getUserBets(userAddress: string) {
    if (this.currentClient.getUserBets) {
      return this.currentClient.getUserBets(userAddress);
    }
    throw new Error('Get user bets not available in current client');
  }

  async healthCheck() {
    if (this.currentClient.healthCheck) {
      return this.currentClient.healthCheck();
    }
    return this.clientType === 'mock';
  }
}

export const apiClientFactory = new ApiClientFactory();
export const apiClient = apiClientFactory;
