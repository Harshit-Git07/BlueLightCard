import { DomainError } from '../redeemVaultStrategy/helpers/DomainError';

export class BallotExpiredError extends DomainError {
  public readonly name = 'BallotExpiredError';
}
