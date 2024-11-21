import { BallotEntity } from '../repositories/BallotsRepository';

export type RedemptionBallotConfig = {
  id: string;
  redemptionId: string;
  drawDate: Date;
  totalTickets: number;
  eventDate: Date;
  offerName: string;
  created: Date;
};

export class RedemptionBallotConfigTransformer {
  static readonly key = 'RedemptionBallotConfigTransformer';

  public transformToRedemptionBallotConfig(ballotEntity: BallotEntity): RedemptionBallotConfig | null {
    return {
      id: ballotEntity.id,
      redemptionId: ballotEntity.redemptionId,
      drawDate: ballotEntity.drawDate,
      totalTickets: ballotEntity.totalTickets,
      eventDate: ballotEntity.eventDate,
      offerName: ballotEntity.offerName,
      created: ballotEntity.created,
    };
  }
}
