import { merge } from 'lodash';
import { ZodTypeAny, z } from 'zod';
import { ExtendEnvVars, EnvVarObject } from './types';
import { envSchema, sharedEnvVars } from './schema';

/**
 * Merges shared env vars per consumption
 * @param extendEnvVars
 */
export function envMerge<K extends string, T extends ZodTypeAny>(
  mergableEnvVars: ExtendEnvVars<K, T>,
) {
  const zodSchema = {} as Record<K, T>;
  const envVars: EnvVarObject = {};

  for (const envVarName in mergableEnvVars) {
    zodSchema[envVarName] = mergableEnvVars[envVarName].schema;
    envVars[envVarName] = mergableEnvVars[envVarName].value;
  }

  const extendedSchema = envSchema.merge(z.object(zodSchema));

  return extendedSchema.parse(merge(sharedEnvVars, envVars));
}
