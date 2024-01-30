/**
 * Casts a value to a type. Use with caution. Do not use this function in application code.
 */
export function as<T>(value: unknown): T {
  return value as T;
}
