import { endOfDay, startOfDay } from 'date-fns';

import { ILogger, Logger } from '@blc-mono/core/utils/logger/logger';

import { BallotsRepository, IBallotsRepository } from '../../repositories/BallotsRepository';
import {
  IRedemptionsEventsRepository,
  RedemptionsEventsRepository,
} from '../../repositories/RedemptionsEventsRepository';

export interface IBallotService {
  findBallotsForDrawDate(): Promise<void>;
}

export class BallotService implements IBallotService {
  static readonly key = 'BallotService';
  static readonly inject = [Logger.key, BallotsRepository.key, RedemptionsEventsRepository.key] as const;

  constructor(
    private readonly logger: ILogger,
    private readonly ballotsRepository: IBallotsRepository,
    private readonly redemptionsEventsRepository: IRedemptionsEventsRepository,
  ) {}

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
}
