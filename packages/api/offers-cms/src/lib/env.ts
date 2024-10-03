import { z } from 'zod';

export const zEnv = z.object({
  VERSION: z.string().default('unknown'),
  ENVIRONMENT: z.enum(['development', 'preview', 'production', 'local']).default('development'),
  OFFERS_BRAND: z.string(),
  DISCOVERY_EVENT_BUS_NAME: z.string(),
});

export type Env = z.infer<typeof zEnv>;
