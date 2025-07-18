import { FastifyInstance } from 'fastify';
import { config } from './config';
import { logger } from './utils/logger';
import { DatabaseService } from './services/database';
import { RedisService } from './services/redis';
import { IngestionService } from './services/ingestion';
import { SchedulerService } from './services/scheduler';

export interface AppContext {
  database: DatabaseService;
  redis: RedisService;
  ingestion: IngestionService;
  scheduler: SchedulerService;
}

export async function createApp(): Promise<FastifyInstance> {
  const fastify = await import('fastify');
  const app = fastify.default({
    logger: true,
    trustProxy: true,
  });

  // Initialize services
  const database = new DatabaseService(config.database);
  const redis = new RedisService(config.redis);
  const ingestion = new IngestionService(database, redis);
  const scheduler = new SchedulerService(ingestion);

  // Store services in app context
  app.decorate('context', {
    database,
    redis,
    ingestion,
    scheduler,
  });

  // Register plugins
  await app.register(import('@fastify/cors'), {
    origin: true,
    credentials: true,
  });

  await app.register(import('@fastify/helmet'), {
    global: true,
  });

  await app.register(import('@fastify/rate-limit'), {
    max: 100,
    timeWindow: '1 minute',
  });

  // Health check endpoint
  app.get('/health', async (request, reply) => {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      services: {
        database: await database.isHealthy(),
        redis: await redis.isHealthy(),
      },
    };
  });

  // Graceful shutdown
  const gracefulShutdown = async (signal: string) => {
    logger.info(`Received ${signal}, shutting down gracefully`);
    
    try {
      await scheduler.stop();
      await database.disconnect();
      await redis.disconnect();
      await app.close();
      process.exit(0);
    } catch (error) {
      logger.error('Error during shutdown:', error);
      process.exit(1);
    }
  };

  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  return app;
}
