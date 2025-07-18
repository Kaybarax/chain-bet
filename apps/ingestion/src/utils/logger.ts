import pino from 'pino';
import { config } from '../config';

const isDevelopment = config.nodeEnv === 'development';

const loggerOptions = {
  level: isDevelopment ? 'debug' : 'info',
  formatters: {
    level: (label: string) => {
      return { level: label };
    },
  },
  timestamp: pino.stdTimeFunctions.isoTime,
  ...(isDevelopment && {
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname',
      },
    },
  }),
};

export const logger = pino(loggerOptions);
