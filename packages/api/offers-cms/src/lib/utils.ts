import { coerce } from 'zod';

export function coerceNumber<T>(inital: T): T | number {
  const test = coerce.number().safeParse(inital);

  if (test.error) {
    return inital;
  }

  return test.data;
}
