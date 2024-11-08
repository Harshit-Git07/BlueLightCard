export function createFactoryMethod<T>(defaults: T) {
  return (overrides?: Partial<T>): T => ({
    ...defaults,
    ...overrides,
  });
}
