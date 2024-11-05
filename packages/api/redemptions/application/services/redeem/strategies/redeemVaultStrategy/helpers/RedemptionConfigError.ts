import { DomainError } from './DomainError';

export class RedemptionConfigError extends DomainError {
  public readonly name = 'RedemptionConfigError';
}
