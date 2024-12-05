import { z } from 'zod';

import { eventSchema } from '@blc-mono/core/schemas/event';
import { Result } from '@blc-mono/core/types/result';
import { ILogger, Logger } from '@blc-mono/core/utils/logger/logger';
import { BallotService, IBallotService } from '@blc-mono/redemptions/application/services/ballot/BallotService';
import { RedemptionsBallotEvents } from '@blc-mono/redemptions/infrastructure/eventBridge/events/ballot';
import { ballotsTable } from '@blc-mono/redemptions/libs/database/schema';

import { EventBridgeController, UnknownEventBridgeEvent } from '../EventBridgeController';

export type BallotEntityWithId = { ballotId: (typeof ballotsTable.$inferSelect)['id'] };

const BallotUnsuccessfulEventDetailSchema = z.object({
  ballotId: z.coerce.string(),
});

const BallotUnsuccessfulEventSchema = eventSchema(
  RedemptionsBallotEvents.BALLOT_UNSUCCESSFUL,
  z.string(),
  BallotUnsuccessfulEventDetailSchema,
);

export type BallotUnsuccessfulEvent = z.infer<typeof BallotUnsuccessfulEventSchema>;

export class UnsuccessfulBallotController extends EventBridgeController<BallotUnsuccessfulEvent> {
  static readonly inject = [Logger.key, BallotService.key] as const;

  constructor(
    logger: ILogger,
    protected ballotService: IBallotService,
  ) {
    super(logger);
  }

  protected parseRequest(request: UnknownEventBridgeEvent): Result<BallotUnsuccessfulEvent, Error> {
    this.logger.info({
      message: 'Parsing request',
      context: {
        request,
      },
    });
    return this.zodParseRequest(request, BallotUnsuccessfulEventSchema);
  }

  protected async handle(event: BallotUnsuccessfulEvent): Promise<void> {
    this.logger.info({ message: 'Handle ballot unsuccessful request', context: { event } });
    await this.ballotService.notifyEntriesOfBallotOutcome(event.detail.ballotId, 'unsuccessful');
  }
}
