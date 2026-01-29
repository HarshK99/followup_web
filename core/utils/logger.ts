/**
 * Logger utility for frontend development
 * Only logs in development environment to avoid shipping debug logs to production
 */

const isDev = process.env.NODE_ENV === 'development';

export const logger = {
  log: (...args: any[]) => {
    if (isDev) {
      console.log(...args);
    }
  },

  debug: (...args: any[]) => {
    if (isDev) {
      console.debug(...args);
    }
  },

  info: (...args: any[]) => {
    if (isDev) {
      console.info(...args);
    }
  },

  // Keep error and warn for production error reporting
  error: (...args: any[]) => {
    console.error(...args);
  },

  warn: (...args: any[]) => {
    console.warn(...args);
  },
};