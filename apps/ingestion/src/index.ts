import dotenv from 'dotenv';
import { connectToDatabase } from './services/database';
import { logger } from './utils/logger';
import { startIngestion } from './services/ingestion';

// Load environment variables
dotenv.config();

async function main() {
  try {
    logger.info('Starting data ingestion service...');

    // Connect to the database
    await connectToDatabase();

    // Start the ingestion process
    await startIngestion();

    logger.info('Data ingestion service started successfully');
  } catch (error) {
    logger.error('Failed to start data ingestion service', { error });
    process.exit(1);
  }
}

// Handle process termination
process.on('SIGINT', () => {
  logger.info('Shutting down data ingestion service...');
  process.exit(0);
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught exception', { error });
  process.exit(1);
});

// Start the application
main();
