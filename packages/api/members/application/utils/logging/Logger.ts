import { Logger } from '@aws-lambda-powertools/logger';

const SERVICE = process.env.SERVICE as string;

// Middleware will add logging context to this logger so consumers do not need to
export const logger = new Logger({ serviceName: SERVICE });
