import { z } from 'zod';
import { EnvVarObject } from './types';

// shared env vars
export const sharedEnvVars: EnvVarObject = {
  APP_BRAND: process.env.NEXT_PUBLIC_APP_BRAND || process.env.STORYBOOK_APP_BRAND,
};

export const envSchema = z.object({
  APP_BRAND: z.enum(['blc-uk-current', 'blc-uk', 'blc-au', 'dds-uk']).default('blc-uk'),
});
