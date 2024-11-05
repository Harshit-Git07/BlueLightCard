import { DomainError } from './DomainError';

export class MaxPerUserReachedError extends DomainError {
  public readonly name = 'MaxPerUserReachedError';
}
