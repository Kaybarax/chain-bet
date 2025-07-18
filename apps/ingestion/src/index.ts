import { createApp } from './app';
import { config } from './config';
import { logger } from './utils/logger';

async function bootstrap() {
  try {
    const app = await createApp();
    
    const address = await app.listen({
      port: config.port,
      host: config.host,
    });
    
    logger.info(`🚀 Ingestion service is running on ${address}`);
    logger.info(`📊 Environment: ${config.nodeEnv}`);
    logger.info(`🔧 Database: ${config.database.url}`);
    logger.info(`🗄️ Redis: ${config.redis.url}`);
    
  } catch (error) {
    logger.error('Failed to start application:', error);
    process.exit(1);
  }
}

bootstrap();
