export abstract class DomainError extends Error {
  abstract readonly name: string;

  constructor(
    public readonly message: string,
    public readonly kind: string | null = null,
  ) {
    super(message);
  }
}
