import pino from 'pino';

// Determine if we're in production
const isProduction = import.meta.env.PROD;

// Base logger configuration
const loggerOptions: pino.LoggerOptions = {
  level: isProduction ? 'info' : 'debug',
  browser: {
    // In production, only log errors and warnings to console
    // In development, log everything
    asObject: true,
    transmit: {
      level: isProduction ? 'error' : 'debug',
      send: (level, logEvent) => {
        // In a real application, we would send logs to a server
        // For now, we'll just log to console
        if (isProduction && level === 'error') {
          // In production, we could send errors to a monitoring service
          console.error('Error log:', logEvent);
        }
      },
    },
  },
  // Add application name and version
  base: {
    app: 'todo-web',
    version: import.meta.env.PACKAGE_VERSION || '0.0.1',
    env: import.meta.env.MODE,
  },
};

// Create the logger instance
export const logger = pino(loggerOptions);

// Export a child logger factory for components
export const createChildLogger = (component: string, context = {}) => {
  return logger.child({ component, ...context });
};

// Example usage:
// const log = createChildLogger('TodoList');
// log.info('Component mounted');
// log.error({ error }, 'Failed to fetch todos');
