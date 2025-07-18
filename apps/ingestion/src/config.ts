import dotenv from 'dotenv';
import { z } from 'zod';

// Load environment variables
dotenv.config();

const configSchema = z.object({
  nodeEnv: z.enum(['development', 'production', 'test']).default('development'),
  port: z.number().default(3002),
  host: z.string().default('0.0.0.0'),
  
  database: z.object({
    url: z.string().default('mongodb://admin:password@localhost:27017/chainbet?authSource=admin'),
  }),
  
  redis: z.object({
    url: z.string().default('redis://localhost:6379'),
  }),
  
  elasticsearch: z.object({
    url: z.string().default('http://localhost:9200'),
  }),
  
  gemini: z.object({
    apiKey: z.string().optional(),
    baseUrl: z.string().default('https://api.gemini.com'),
  }),
  
  ingestion: z.object({
    batchSize: z.number().default(100),
    intervalMs: z.number().default(60000), // 1 minute
    retryAttempts: z.number().default(3),
    retryDelayMs: z.number().default(5000),
  }),
});

const env = {
  nodeEnv: process.env.NODE_ENV as 'development' | 'production' | 'test',
  port: process.env.PORT ? parseInt(process.env.PORT, 10) : undefined,
  host: process.env.HOST,
  
  database: {
    url: process.env.DATABASE_URL || process.env.MONGODB_URI,
  },
  
  redis: {
    url: process.env.REDIS_URL,
  },
  
  elasticsearch: {
    url: process.env.ELASTICSEARCH_URL,
  },
  
  gemini: {
    apiKey: process.env.GEMINI_API_KEY,
    baseUrl: process.env.GEMINI_BASE_URL,
  },
  
  ingestion: {
    batchSize: process.env.INGESTION_BATCH_SIZE ? parseInt(process.env.INGESTION_BATCH_SIZE, 10) : undefined,
    intervalMs: process.env.INGESTION_INTERVAL_MS ? parseInt(process.env.INGESTION_INTERVAL_MS, 10) : undefined,
    retryAttempts: process.env.INGESTION_RETRY_ATTEMPTS ? parseInt(process.env.INGESTION_RETRY_ATTEMPTS, 10) : undefined,
    retryDelayMs: process.env.INGESTION_RETRY_DELAY_MS ? parseInt(process.env.INGESTION_RETRY_DELAY_MS, 10) : undefined,
  },
};

export const config = configSchema.parse(env);
