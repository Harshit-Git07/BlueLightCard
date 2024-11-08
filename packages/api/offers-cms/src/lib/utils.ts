import { coerce } from 'zod';

/**
 * Attempts to coerce the input value to a number. If the coercion fails,
 * the original input value is returned.
 *
 * @template T - The type of the input value.
 * @param {T} inital - The value to be coerced to a number.
 * @returns {T | number} - The coerced number if successful, otherwise the original input value.
 */
export function coerceNumber<T>(inital: T): T | number {
  const test = coerce.number().safeParse(inital);

  if (test.error) {
    return inital;
  }

  return test.data;
}
