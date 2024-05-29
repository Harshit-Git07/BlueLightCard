import { ZodTypeAny, z } from 'zod';
import { envSchema } from './schema';

export type EnvVarObject = Record<string, string | undefined>;
export type ExtendEnvVars<K extends string, T extends ZodTypeAny> = Record<
  K,
  {
    value: string | undefined;
    schema: T;
  }
>;

export type EnvSchemaType = z.infer<typeof envSchema>;
