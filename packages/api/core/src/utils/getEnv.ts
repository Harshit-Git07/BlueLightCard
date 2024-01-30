import { z } from "zod";

/**
 * Get the raw value of an environment variable. Does not throw if the variable is not set.
 */
export function getEnvRaw(name: string): string | undefined {
  if (!Object.prototype.hasOwnProperty.call(process.env, name)) {
    return undefined;
  }

  return process.env[name];
}

/**
 * Get the value of an environment variable. Throws if the variable is not set.
 */
export function getEnv(name: string): string {
  const value = getEnvRaw(name);

  if (value === undefined) {
    throw new Error('Missing environment variable for ' + name);
  }

  return value;
}

/**
 * Get the value of an environment variable. Returns the default value if the variable is not set.
 */
export function getEnvOrDefault(name: string, defaultValue: string): string {
  const value = getEnvRaw(name);

  if (value === undefined) {
    return defaultValue;
  }

  return value;
}

/**
 * Get the value of an environment variable and validate it against a `zod` validator.
 * Throws if the variable is not set or if the value is invalid.
 */
export function getEnvValidated<Validator extends z.Schema>(name: string, validator: Validator): z.infer<Validator> {
  const value = getEnvRaw(name);
  return validator.parse(value);
}

/**
 * Get the value of an environment variable and validate it against a `zod` validator. Returns the
 * default value if the variable is not set. Throws if the value is invalid.
 */
export function getEnvOrDefaultValidated<Validator extends z.Schema>(
  name: string,
  defaultValue: z.infer<Validator>,
  validator: Validator,
): z.infer<Validator> {
  const value = getEnvRaw(name);

  if (value === undefined) {
    return defaultValue;
  }

  return validator.parse(value);
}
