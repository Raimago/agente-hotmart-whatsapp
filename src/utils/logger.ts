const LOG_LEVEL = process.env.LOG_LEVEL || 'info';

const levels = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const getTimestamp = (): string => {
  return new Date().toISOString();
};

const log = (level: keyof typeof levels, message: string, ...args: any[]) => {
  if (levels[level] >= levels[LOG_LEVEL as keyof typeof levels] || 0) {
    const timestamp = getTimestamp();
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`;
    console.log(prefix, message, ...args);
  }
};

export const logger = {
  debug: (message: string, ...args: any[]) => log('debug', message, ...args),
  info: (message: string, ...args: any[]) => log('info', message, ...args),
  warn: (message: string, ...args: any[]) => log('warn', message, ...args),
  error: (message: string, ...args: any[]) => log('error', message, ...args),
};


