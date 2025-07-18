// FED2T1S_LiveApiClient: Live API Client for backend integration
import { Match, Market, BetSelection } from './mock';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export class LiveApiClient {
  private async fetchWithErrorHandling<T>(endpoint: string, options?: RequestInit): Promise<T> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} - ${response.statusText}`);
      }

      return await response.json() as T;
    } catch (error) {
      console.error(`API call failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // FED2T1S_LiveApiClient: Get matches based on search query
  async getMatches(query: string = ''): Promise<Match[]> {
    const params = new URLSearchParams();
    if (query.trim()) {
      params.append('q', query);
    }

    const endpoint = `/matches${params.toString() ? `?${params.toString()}` : ''}`;
    return this.fetchWithErrorHandling<Match[]>(endpoint);
  }

  // Get match details by ID
  async getMatchById(matchId: string): Promise<Match | null> {
    try {
      return await this.fetchWithErrorHandling<Match>(`/matches/${matchId}`);
    } catch (error) {
      // Return null if match not found
      return null;
    }
  }

  // Get markets for a specific match
  async getMarkets(matchId: string): Promise<Market[]> {
    return this.fetchWithErrorHandling<Market[]>(`/matches/${matchId}/markets`);
  }

  // Live AI analysis (FED2T6S_AIAnalysis)
  async analyzeBet(matchId: string, selections: BetSelection[]): Promise<any> {
    return this.fetchWithErrorHandling<any>(`/matches/${matchId}/analyze`, {
      method: 'POST',
      body: JSON.stringify({ selections }),
    });
  }

  // Place a bet (FED3T1S_PlaceBet)
  async placeBet(betData: {
    matchId: string;
    selections: BetSelection[];
    totalStake: number;
    userAddress: string;
  }): Promise<any> {
    return this.fetchWithErrorHandling<any>('/bets', {
      method: 'POST',
      body: JSON.stringify(betData),
    });
  }

  // Get user's bet history (FED3T3W_UserBetHistory)
  async getUserBets(userAddress: string): Promise<any[]> {
    return this.fetchWithErrorHandling<any[]>(`/users/${userAddress}/bets`);
  }

  // Health check to verify API connectivity
  async healthCheck(): Promise<boolean> {
    try {
      await this.fetchWithErrorHandling<{ status: string }>('/health');
      return true;
    } catch (error) {
      return false;
    }
  }
}

export const liveApiClient = new LiveApiClient();
