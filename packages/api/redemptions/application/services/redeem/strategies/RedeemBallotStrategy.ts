import { MemberRedemptionEventDetail } from '@blc-mono/core/schemas/redemptions';
import { ILogger, Logger } from '@blc-mono/core/utils/logger/logger';
import { isRedeemDateNotInRange } from '@blc-mono/redemptions/application/helpers/isRedeemDateInRange';
import {
  BallotEntriesRepository,
  IBallotEntriesRepository,
} from '@blc-mono/redemptions/application/repositories/BallotEntriesRepository';
import {
  BallotsRepository,
  IBallotsRepository,
} from '@blc-mono/redemptions/application/repositories/BallotsRepository';
import {
  IRedemptionsEventsRepository,
  RedemptionsEventsRepository,
} from '@blc-mono/redemptions/application/repositories/RedemptionsEventsRepository';
import { ballotEntryStatusEnum } from '@blc-mono/redemptions/libs/database/schema';

import { RedemptionConfigEntity } from '../../../repositories/RedemptionConfigRepository';

import { IRedeemStrategy, RedeemBallotStrategyResult, RedeemParams } from './IRedeemStrategy';
import { MemberRedemptionEventDetailBuilder } from './MemberRedemptionEventDetailBuilder';
import { AlreadyEnteredBallotError } from './redeemBallotStrategy/AlreadyEnteredBallotError';
import { BallotExpiredError } from './redeemBallotStrategy/BallotExpiredError';
import { NotFoundError } from './redeemVaultStrategy/helpers/NotFoundError';

export class RedeemBallotStrategy implements IRedeemStrategy {
  static readonly key = 'RedeemBallotStrategy' as const;
  static readonly inject = [
    BallotsRepository.key,
    BallotEntriesRepository.key,
    RedemptionsEventsRepository.key,
    MemberRedemptionEventDetailBuilder.key,
    Logger.key,
  ] as const;

  constructor(
    private readonly ballotRepository: IBallotsRepository,
    private readonly ballotEntriesRepository: IBallotEntriesRepository,
    private readonly redemptionsEventsRepository: IRedemptionsEventsRepository,
    private readonly memberRedemptionEventDetailBuilder: MemberRedemptionEventDetailBuilder,
    private readonly logger: ILogger,
  ) {}

  async redeem(
    redemptionConfigEntity: RedemptionConfigEntity,
    params: RedeemParams,
  ): Promise<RedeemBallotStrategyResult> {
    const { id, redemptionType } = redemptionConfigEntity;
    const memberId = params.memberId;
    const entryDate = new Date();

    if (redemptionType !== 'ballot') {
      throw new Error('Unexpected redemption type');
    }

    const ballot = await this.ballotRepository.findOneByRedemptionId(redemptionConfigEntity.id);

    if (!ballot) {
      this.logger.error({
        message: `Ballot not found`,
        context: {
          redemptionId: id,
        },
      });
      throw new NotFoundError('Ballot not found', 'BallotNotFound');
    }

    // Only allow a ballot entry until 21:30 on the drawDate
    if (isRedeemDateNotInRange(ballot.drawDate, entryDate)) {
      this.logger.error({
        message: `Ballot has expired`,
        context: {
          redemptionId: id,
        },
      });
      throw new BallotExpiredError('Ballot has expired', 'BallotExpired');
    }

    // Member should only be able to redeem ballot type once
    const entry = await this.ballotEntriesRepository.findOneByBallotAndMemberId(memberId, ballot.id);

    if (entry) {
      this.logger.error({
        message: `Member has already entered ballot`,
        context: {
          redemptionId: id,
        },
      });
      throw new AlreadyEnteredBallotError('Member has already entered ballot', 'AlreadyEnteredBallot');
    }

    await this.ballotEntriesRepository.create({
      ballotId: ballot.id,
      entryDate: entryDate,
      memberId: memberId,
      status: ballotEntryStatusEnum.enumValues[0],
    });

    const memberRedemptionEventDetail: MemberRedemptionEventDetail =
      this.memberRedemptionEventDetailBuilder.buildMemberRedemptionEventDetail({
        redemptionConfigEntity,
        params,
        ballotDetails: {
          drawDate: ballot.drawDate,
          eventDate: ballot.eventDate,
          totalTickets: ballot.totalTickets,
          offerName: ballot.offerName,
        },
      });

    await this.redemptionsEventsRepository.publishRedemptionEvent(memberRedemptionEventDetail).catch((error) => {
      this.logger.error({
        message: '[UNHANDLED ERROR] Error while publishing member redeem intent event',
        error,
      });
    });

    return Promise.resolve({
      kind: 'Ok',
      redemptionType: 'ballot',
      redemptionDetails: {
        ballotDetails: {
          drawDate: ballot.drawDate,
          eventDate: ballot.eventDate,
          totalTickets: ballot.totalTickets,
          offerName: ballot.offerName,
        },
      },
    });
  }
}
