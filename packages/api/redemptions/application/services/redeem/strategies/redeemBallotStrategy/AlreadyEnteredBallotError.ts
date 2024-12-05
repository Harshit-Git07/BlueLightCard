import { DomainError } from '../redeemVaultStrategy/helpers/DomainError';

export class AlreadyEnteredBallotError extends DomainError {
  public readonly name = 'AlreadyEnteredBallotError';
}
