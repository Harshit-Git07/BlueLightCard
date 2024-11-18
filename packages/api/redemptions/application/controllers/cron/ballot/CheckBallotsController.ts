import { z } from 'zod';

import { eventSchema } from '@blc-mono/core/schemas/event';
import { Result } from '@blc-mono/core/types/result';
import { ILogger, Logger } from '@blc-mono/core/utils/logger/logger';
import { BallotService, IBallotService } from '@blc-mono/redemptions/application/services/ballot/BallotService';

import { CronController, UnknownScheduledEvent } from '../CronController';

const cronEventSchema = eventSchema('aws.events', z.literal('Scheduled Event'), z.object({}));
type CronEvent = z.infer<typeof cronEventSchema>;

const RunBallotDetailSchema = z.object({
  ballotId: z.string(),
});

export type RunBallotSchemaEventDetail = z.infer<typeof RunBallotDetailSchema>;

export class CheckBallotsController extends CronController<CronEvent> {
  static readonly inject = [Logger.key, BallotService.key] as const;

  constructor(
    logger: ILogger,
    protected ballotService: IBallotService,
  ) {
    super(logger);
  }

  protected parseRequest(request: UnknownScheduledEvent): Result<CronEvent, Error> {
    this.logger.info({
      message: 'Parsing request',
      context: {
        request,
      },
    });
    return this.zodParseRequest(request, cronEventSchema);
  }

  protected async handle(event: UnknownScheduledEvent): Promise<void> {
    this.logger.info({ message: 'Handle event', context: { event } });
    await this.ballotService.findBallotsForDrawDate();
  }
}
