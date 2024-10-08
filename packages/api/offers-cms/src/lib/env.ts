import { z } from 'zod';

export const zEnv = z.object({
  VERSION: z.string().default('unknown'),
  ENVIRONMENT: z.enum(['development', 'preview', 'production', 'local']).default('development'),
  BRAND: z.string(),
});

export type Env = z.infer<typeof zEnv>;
