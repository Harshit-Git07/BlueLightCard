import { DomainError } from './DomainError';

export class NoCodesAvailableError extends DomainError {
  public readonly name = 'NoCodesAvailableError';
}
