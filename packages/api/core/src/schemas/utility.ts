import { z } from 'zod';

/**
 * Validates that the value is a valid URL, empty string, or `undefined`.
 * Empty strings will be transformed to `undefined`.
 */
export const OPTIONAL_URL_SCHEMA = z
  .string()
  .nullable()
  .optional()
  .transform((value) => {
    if (!value) {
      return undefined;
    }
    if (value.trim() === '') {
      return undefined;
    }
    return value;
  })
  .pipe(z.string().url().optional().nullable());
export type OptionalUrl = z.infer<typeof OPTIONAL_URL_SCHEMA>;
