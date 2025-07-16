import { MongoClient, Db } from 'mongodb';
import { logger } from '../utils/logger';

let db: Db;
let client: MongoClient;

/**
 * Connect to the MongoDB database
 */
export async function connectToDatabase(): Promise<Db> {
  if (db) {
    return db;
  }

  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
    const dbName = process.env.MONGODB_DB_NAME || 'todos';

    logger.info('Connecting to MongoDB...', { uri, dbName });

    client = new MongoClient(uri);
    await client.connect();

    db = client.db(dbName);

    logger.info('Connected to MongoDB successfully');

    return db;
  } catch (error) {
    logger.error('Failed to connect to MongoDB', { error });
    throw error;
  }
}

/**
 * Close the database connection
 */
export async function closeDatabaseConnection(): Promise<void> {
  if (client) {
    await client.close();
    logger.info('Closed MongoDB connection');
  }
}

/**
 * Get the database instance
 */
export function getDb(): Db {
  if (!db) {
    throw new Error('Database not connected. Call connectToDatabase() first.');
  }
  return db;
}
