import { MongoClient, Db } from 'mongodb';
import { logger } from '../utils/logger';

export class DatabaseService {
  private client: MongoClient;
  private db!: Db;
  private isConnected = false;

  constructor(private config: { url: string }) {
    this.client = new MongoClient(config.url);
  }

  async connect(): Promise<void> {
    try {
      await this.client.connect();
      this.db = this.client.db();
      this.isConnected = true;
      logger.info('Connected to MongoDB');
    } catch (error) {
      logger.error('Failed to connect to MongoDB:', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    try {
      await this.client.close();
      this.isConnected = false;
      logger.info('Disconnected from MongoDB');
    } catch (error) {
      logger.error('Error disconnecting from MongoDB:', error);
      throw error;
    }
  }

  async isHealthy(): Promise<boolean> {
    try {
      if (!this.isConnected) {
        await this.connect();
      }
      await this.db.admin().ping();
      return true;
    } catch (error) {
      logger.error('Database health check failed:', error);
      return false;
    }
  }

  getDb(): Db {
    if (!this.isConnected) {
      throw new Error('Database is not connected');
    }
    return this.db;
  }

  async ensureIndexes(): Promise<void> {
    try {
      const collections = {
        matches: 'matches',
        bets: 'bets',
        users: 'users',
        odds: 'odds',
      };

      // Create indexes for matches collection
      await this.db.collection(collections.matches).createIndex({ matchId: 1 }, { unique: true });
      await this.db.collection(collections.matches).createIndex({ startTime: 1 });
      await this.db.collection(collections.matches).createIndex({ league: 1 });
      
      // Create indexes for bets collection
      await this.db.collection(collections.bets).createIndex({ userId: 1 });
      await this.db.collection(collections.bets).createIndex({ matchId: 1 });
      await this.db.collection(collections.bets).createIndex({ status: 1 });
      
      // Create indexes for odds collection
      await this.db.collection(collections.odds).createIndex({ matchId: 1, provider: 1 });
      await this.db.collection(collections.odds).createIndex({ updatedAt: 1 });

      logger.info('Database indexes ensured');
    } catch (error) {
      logger.error('Failed to ensure database indexes:', error);
      throw error;
    }
  }
}
