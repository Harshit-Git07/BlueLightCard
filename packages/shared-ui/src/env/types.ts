import { ZodTypeAny } from 'zod';

export type EnvVarObject = Record<string, string | undefined>;
export type ExtendEnvVars<K extends string, T extends ZodTypeAny> = Record<
  K,
  {
    value: string | undefined;
    schema: T;
  }
>;
