import { z } from 'zod';

/**
 * Validates that the value is a valid URL, empty string, or `undefined`.
 * Empty strings will be transformed to `undefined`.
 */
export const OPTIONAL_URL_SCHEMA = z
  .string()
  .transform((value) => (value.trim() === '' ? undefined : value))
  .pipe(z.string().url().optional());
export type OptionalUrl = z.infer<typeof OPTIONAL_URL_SCHEMA>;
