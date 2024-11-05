import { DomainError } from './DomainError';

export class NotFoundError extends DomainError {
  public readonly name = 'NotFoundError';

  constructor(
    public readonly message: string,
    public readonly kind: string,
  ) {
    super(message, kind);
  }
}
