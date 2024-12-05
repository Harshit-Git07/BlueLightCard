import { BallotEntity } from '../repositories/BallotsRepository';

export type RedemptionBallotConfig = {
  id: string;
  drawDate: Date;
  totalTickets: number;
  eventDate: Date;
  offerName: string;
  status: string;
};

export class RedemptionBallotConfigTransformer {
  static readonly key = 'RedemptionBallotConfigTransformer';

  public transformToRedemptionBallotConfig(ballotEntity: BallotEntity): RedemptionBallotConfig | null {
    return {
      id: ballotEntity.id,
      drawDate: ballotEntity.drawDate,
      totalTickets: ballotEntity.totalTickets,
      eventDate: ballotEntity.eventDate,
      offerName: ballotEntity.offerName,
      status: ballotEntity.status,
    };
  }
}
