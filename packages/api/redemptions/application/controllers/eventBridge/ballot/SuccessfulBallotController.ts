import { z } from 'zod';

import { eventSchema } from '@blc-mono/core/schemas/event';
import { Result } from '@blc-mono/core/types/result';
import { ILogger, Logger } from '@blc-mono/core/utils/logger/logger';
import { BallotService, IBallotService } from '@blc-mono/redemptions/application/services/ballot/BallotService';
import { RedemptionsBallotEvents } from '@blc-mono/redemptions/infrastructure/eventBridge/events/ballot';
import { ballotsTable } from '@blc-mono/redemptions/libs/database/schema';

import { EventBridgeController, UnknownEventBridgeEvent } from '../EventBridgeController';

export type BallotEntityWithId = { ballotId: (typeof ballotsTable.$inferSelect)['id'] };

const BallotSuccessfulEventDetailSchema = z.object({
  ballotId: z.coerce.string(),
});

const BallotSuccessfulEventSchema = eventSchema(
  RedemptionsBallotEvents.BALLOT_SUCCESSFUL,
  z.string(),
  BallotSuccessfulEventDetailSchema,
);

export type BallotSuccessfulEvent = z.infer<typeof BallotSuccessfulEventSchema>;

export class SuccessfulBallotController extends EventBridgeController<BallotSuccessfulEvent> {
  static readonly inject = [Logger.key, BallotService.key] as const;

  constructor(
    logger: ILogger,
    protected ballotService: IBallotService,
  ) {
    super(logger);
  }

  protected parseRequest(request: UnknownEventBridgeEvent): Result<BallotSuccessfulEvent, Error> {
    this.logger.info({
      message: 'Parsing request',
      context: {
        request,
      },
    });
    return this.zodParseRequest(request, BallotSuccessfulEventSchema);
  }

  protected async handle(event: BallotSuccessfulEvent): Promise<void> {
    this.logger.info({ message: 'Handle ballot successful request', context: { event } });
    await this.ballotService.notifyEntriesOfBallotOutcome(event.detail.ballotId, 'confirmed');
  }
}
