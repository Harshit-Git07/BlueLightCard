import { z } from 'zod';
import { EnvVarObject } from './types';

// shared env vars
export const sharedEnvVars: EnvVarObject = {
  APP_BRAND: process.env.NEXT_PUBLIC_APP_BRAND,
  FLAG_NEW_TOKENS: process.env.NEXT_PUBLIC_FLAG_NEW_TOKENS ?? process.env.STORYBOOK_FLAG_NEW_TOKENS,
};

export const envSchema = z.object({
  APP_BRAND: z.enum(['blc-uk-current', 'blc-uk', 'blc-au', 'dds-uk']).default('blc-uk'),
  FLAG_NEW_TOKENS: z
    .enum(['true', 'false'])
    .transform((value) => value === 'true')
    .optional(),
});
