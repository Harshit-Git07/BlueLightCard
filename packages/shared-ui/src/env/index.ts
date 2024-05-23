import { envSchema, sharedEnvVars } from './schema';

export const env = envSchema.parse(sharedEnvVars);

export * from './utils';
