import { endOfDay, startOfDay } from 'date-fns';

import { ILogger, Logger } from '@blc-mono/core/utils/logger/logger';
import { isBallotReadyToRun } from '@blc-mono/redemptions/application/helpers/isBallotReadyToRun';
import { selectRandomEntries } from '@blc-mono/redemptions/application/helpers/selectRandomEntries';
import {
  ITransactionManager,
  TransactionManager,
} from '@blc-mono/redemptions/infrastructure/database/TransactionManager';

import { BallotEntryStatus } from '../../../libs/database/schema';
import {
  BallotEntriesEntityWithMemberId,
  BallotEntriesRepository,
  IBallotEntriesRepository,
} from '../../repositories/BallotEntriesRepository';
import { BallotsRepository, IBallotsRepository } from '../../repositories/BallotsRepository';
import {
  IRedemptionsEventsRepository,
  RedemptionsEventsRepository,
} from '../../repositories/RedemptionsEventsRepository';
import { RedemptionCustomAttributeTransformer } from '../../transformers/RedemptionCustomAttributeTransformer';
import { EmailService, IEmailService } from '../email/EmailService';

export interface IBallotService {
  findBallotsForDrawDate(): Promise<void>;
  runSingleBallot(ballotId: string, dateOfRun: Date): Promise<void>;
  notifyEntriesOfBallotOutcome(ballotId: string, ballotEntryStatus: BallotEntryStatus): Promise<void>;
}

export class BallotService implements IBallotService {
  static readonly key = 'BallotService';
  static readonly inject = [
    Logger.key,
    BallotsRepository.key,
    RedemptionsEventsRepository.key,
    BallotEntriesRepository.key,
    TransactionManager.key,
    EmailService.key,
    RedemptionCustomAttributeTransformer.key,
  ] as const;

  constructor(
    private readonly logger: ILogger,
    private readonly ballotsRepository: IBallotsRepository,
    private readonly redemptionsEventsRepository: IRedemptionsEventsRepository,
    private readonly ballotsEntriesRepository: IBallotEntriesRepository,
    private readonly transactionManager: ITransactionManager,
    private readonly emailService: IEmailService,
    private readonly redemptionCustomAttributeTransformer: RedemptionCustomAttributeTransformer,
  ) {}

  //rename this to publishBallotsForDrawDate
  public async findBallotsForDrawDate(): Promise<void> {
    const now = new Date();
    const startDrawDate = startOfDay(now);
    const endDrawDate = endOfDay(now);

    const ballots = await this.ballotsRepository.findBallotsForDrawDate(startDrawDate, endDrawDate);

    for (const ballot of ballots) {
      try {
        await this.redemptionsEventsRepository.publishRunBallotEvent(ballot);
      } catch (error) {
        this.logger.error({
          message: '[UNHANDLED ERROR] Error while publishing run ballot details event',
          error,
        });
      }
    }
  }

  public async runSingleBallot(ballotId: string, dateOfRun: Date): Promise<void> {
    const ballot = await this.ballotsRepository.findOneById(ballotId);

    if (!ballot) {
      const message = 'No ballot found';
      this.logger.error({
        message,
        context: {
          ballotId,
          dateOfRun,
        },
      });
      throw new Error(`${message} (ballotId="${ballotId}")`);
    }

    if (ballot.status !== 'pending') {
      const message = 'Ballot is not in a pending state';
      this.logger.error({
        message,
        context: {
          ballotId,
          dateOfRun,
        },
      });
      throw new Error(`${message} (ballotId="${ballotId}")`);
    }

    if (!isBallotReadyToRun(ballot.drawDate, dateOfRun)) {
      const message = 'This ballot is not ready to run, the current date is not the draw date or not after 10pm';
      this.logger.error({
        message,
        context: {
          ballotId,
          dateOfRun,
        },
      });
      throw new Error(`${message} (ballotId="${ballotId}")`);
    }

    const ballotEntries = await this.ballotsEntriesRepository.findByBallotIdAndStatus(ballotId, 'pending');
    if (ballotEntries.length === 0) {
      const message = 'No pending ballot entries found';
      this.logger.error({
        message,
        context: {
          ballotId,
          dateOfRun,
        },
      });
      throw new Error(`${message} (ballotId="${ballotId}")`);
    }

    const selectedEntries = selectRandomEntries(ballotEntries, ballot.totalTickets);
    const ids = selectedEntries.map((entry) => entry.id);

    await this.transactionManager.withTransaction(async (transaction) => {
      const transactionConnection = { db: transaction };
      const repository = this.ballotsEntriesRepository.withTransaction(transactionConnection);

      await this.ballotsRepository.updateBallotStatus(ballotId, 'drawing');

      await repository.updateManyBatchEntriesInArray(ballotId, ids, 'unconfirmed');
      await repository.updateManyBatchEntriesNotInArray(ballotId, ids, 'unsuccessful');

      this.redemptionsEventsRepository.publishSuccessfulBallotEvent({ ballotId });
      this.redemptionsEventsRepository.publishUnsuccessfulBallotEvent({ ballotId });

      await this.ballotsRepository.updateBallotStatus(ballotId, 'drawn');
    });
  }

  public async notifyEntriesOfBallotOutcome(ballotId: string, ballotEntryStatus: BallotEntryStatus): Promise<void> {
    /**
     * {@link https://www.braze.com/docs/api/endpoints/user_data/post_user_track}
     */
    const maximumUsersPerRequestToBraze = 75;
    const setCustomAttributePromises: Promise<void>[] = [];
    let offset = 0;
    let entriesBatch: BallotEntriesEntityWithMemberId[];

    do {
      entriesBatch = await this.ballotsEntriesRepository.findMemberIdsByBallotIdAndStatusWithLimitAndOffset(
        ballotId,
        ballotEntryStatus,
        maximumUsersPerRequestToBraze,
        offset,
      );

      if (entriesBatch.length > 0) {
        const transformedEntries = this.redemptionCustomAttributeTransformer.transformToUsersWithCustomAttributes(
          ballotId,
          entriesBatch,
          ballotEntryStatus,
        );
        setCustomAttributePromises.push(this.emailService.setCustomAttributes(transformedEntries));
        offset += maximumUsersPerRequestToBraze;
      }
    } while (entriesBatch.length > 0);

    await Promise.all(setCustomAttributePromises).finally(() => {
      this.logger.info({
        message: `All set custom attribute promises resolved`,
        context: { message: `BallotService.notifyEntriesOfBallotOutcome: ${ballotEntryStatus}` },
      });
    });
  }
}
