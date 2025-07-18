import * as cron from 'node-cron';
import { IngestionService } from './ingestion';
import { logger } from '../utils/logger';
import { config } from '../config';

export class SchedulerService {
  private jobs: Map<string, cron.ScheduledTask> = new Map();

  constructor(private ingestionService: IngestionService) {}

  async start(): Promise<void> {
    try {
      logger.info('Starting scheduler service...');
      
      // Schedule match ingestion every 15 minutes
      const matchIngestionJob = cron.schedule('*/15 * * * *', async () => {
        try {
          await this.ingestionService.ingestMatches();
        } catch (error) {
          logger.error('Scheduled match ingestion failed:', error);
        }
      }, {
        scheduled: false,
        timezone: 'UTC',
      });
      
      this.jobs.set('match-ingestion', matchIngestionJob);
      
      // Schedule odds ingestion every 5 minutes
      const oddsIngestionJob = cron.schedule('*/5 * * * *', async () => {
        try {
          await this.ingestionService.ingestOdds();
        } catch (error) {
          logger.error('Scheduled odds ingestion failed:', error);
        }
      }, {
        scheduled: false,
        timezone: 'UTC',
      });
      
      this.jobs.set('odds-ingestion', oddsIngestionJob);
      
      // Schedule cleanup job daily at 2 AM
      const cleanupJob = cron.schedule('0 2 * * *', async () => {
        try {
          await this.cleanupOldData();
        } catch (error) {
          logger.error('Scheduled cleanup failed:', error);
        }
      }, {
        scheduled: false,
        timezone: 'UTC',
      });
      
      this.jobs.set('cleanup', cleanupJob);
      
      // Start all jobs
      this.jobs.forEach((job, name) => {
        job.start();
        logger.info(`Started scheduled job: ${name}`);
      });
      
      logger.info('Scheduler service started successfully');
    } catch (error) {
      logger.error('Failed to start scheduler service:', error);
      throw error;
    }
  }

  async stop(): Promise<void> {
    try {
      logger.info('Stopping scheduler service...');
      
      this.jobs.forEach((job, name) => {
        job.stop();
        logger.info(`Stopped scheduled job: ${name}`);
      });
      
      this.jobs.clear();
      logger.info('Scheduler service stopped successfully');
    } catch (error) {
      logger.error('Failed to stop scheduler service:', error);
      throw error;
    }
  }

  private async cleanupOldData(): Promise<void> {
    try {
      logger.info('Starting data cleanup...');
      
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      // This is a placeholder for cleanup logic
      // In a real implementation, you might:
      // - Archive old match data
      // - Remove old odds data
      // - Clean up cached data
      // - Compress logs
      
      logger.info('Data cleanup completed');
    } catch (error) {
      logger.error('Data cleanup failed:', error);
      throw error;
    }
  }

  getJobStatus(): { [key: string]: boolean } {
    const status: { [key: string]: boolean } = {};
    
    this.jobs.forEach((job, name) => {
      // Check if job is running - use destroyed property to check if active
      status[name] = !(job as any).destroyed;
    });
    
    return status;
  }
}
