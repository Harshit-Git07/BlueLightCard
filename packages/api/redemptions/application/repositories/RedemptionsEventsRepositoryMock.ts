import { IRedemptionsEventsRepository } from './RedemptionsEventsRepository';

export class RedemptionsEventsRepositoryMock implements IRedemptionsEventsRepository {
  public publishMemberRetrievedRedemptionDetailsEvent = jest.fn().mockResolvedValue(undefined);
  public publishMemberRedeemIntentEvent = jest.fn().mockResolvedValue(undefined);
  public publishRedemptionEvent = jest.fn().mockResolvedValue(undefined);
  public publishVaultBatchCreatedEvent = jest.fn().mockResolvedValue(undefined);
  public publishRunBallotEvent = jest.fn().mockResolvedValue(undefined);
  public publishSuccessfulBallotEvent = jest.fn().mockResolvedValue(undefined);
  public publishUnsuccessfulBallotEvent = jest.fn().mockResolvedValue(undefined);
}
