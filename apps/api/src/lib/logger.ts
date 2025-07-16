import pino from 'pino';
import { pinoHttp } from 'pino-http';

// Determine if we're in production
const isProduction = process.env.NODE_ENV === 'production';

// Base logger configuration
const loggerOptions: pino.LoggerOptions = {
  level: process.env.LOG_LEVEL || (isProduction ? 'info' : 'debug'),
  formatters: {
    level: (label) => {
      return { level: label };
    },
  },
  // In development, use pretty printing
  transport: !isProduction
    ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:standard',
        },
      }
    : undefined,
  // Add application name and version
  base: {
    app: 'todo-api',
    version: process.env.npm_package_version,
    env: process.env.NODE_ENV,
  },
};

// Create the logger instance
export const logger = pino(loggerOptions);

// Configure Elasticsearch transport in production
if (isProduction && process.env.ELASTICSEARCH_URL) {
  const pinoElastic = require('pino-elasticsearch');
  const streamToElastic = pinoElastic({
    index: 'todo-api-logs',
    node: process.env.ELASTICSEARCH_URL,
    flushBytes: 1000 * 1024, // 1MB
    flushInterval: 30 * 1000, // 30 seconds
  });

  // Handle potential stream errors
  streamToElastic.on('error', (error: Error) => {
    console.error('Elasticsearch logging error:', error);
  });

  // Send logs to Elasticsearch
  logger.info('Elasticsearch logging enabled');
  const stream = pino.multistream([
    { stream: process.stdout },
    { stream: streamToElastic },
  ]);

  // Update the logger to use the multi-stream
  const multiStreamLogger = pino(loggerOptions, stream);
  Object.assign(logger, multiStreamLogger);
}

// HTTP request logger middleware
export const httpLogger = pinoHttp({
  logger,
  // Don't log health check endpoints
  autoLogging: {
    ignore: (req) => req.url?.includes('/api/health') || false,
  },
  // Add custom request properties
  customProps: (req, res) => {
    return {
      correlation: req.headers['x-correlation-id'] || req.id,
      user: (req as any).user?.id,
    };
  },
  // Customize the request message
  customLogLevel: (req, res, err) => {
    if (res.statusCode >= 500 || err) {
      return 'error';
    } else if (res.statusCode >= 400) {
      return 'warn';
    }
    return 'info';
  },
  // Customize the request serialization
  serializers: {
    req: (req) => ({
      id: req.id,
      method: req.method,
      url: req.url,
      query: req.query,
      params: (req as any).params,
      headers: {
        'user-agent': req.headers['user-agent'],
        'content-type': req.headers['content-type'],
        'x-correlation-id': req.headers['x-correlation-id'],
      },
    }),
  },
});

// Export a child logger factory for components
export const createChildLogger = (component: string, context = {}) => {
  return logger.child({ component, ...context });
};
