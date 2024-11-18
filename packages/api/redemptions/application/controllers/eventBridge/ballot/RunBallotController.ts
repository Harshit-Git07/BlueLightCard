import { z } from 'zod';

import { eventSchema } from '@blc-mono/core/schemas/event';
import { Result } from '@blc-mono/core/types/result';
import { ILogger, Logger } from '@blc-mono/core/utils/logger/logger';
import { RedemptionsBallotEvents } from '@blc-mono/redemptions/infrastructure/eventBridge/events/ballot';
import { ballotsTable } from '@blc-mono/redemptions/libs/database/schema';

import { EventBridgeController, UnknownEventBridgeEvent } from '../EventBridgeController';

export type BallotEntityWithId = { ballotId: (typeof ballotsTable.$inferSelect)['id'] };

const BallotRunEventDetailSchema = z.object({
  ballotId: z.coerce.string(),
});

const BallotRunEventSchema = eventSchema(RedemptionsBallotEvents.BALLOT_RUN, z.string(), BallotRunEventDetailSchema);

export type BallotRunEvent = z.infer<typeof BallotRunEventSchema>;

export class RunBallotController extends EventBridgeController<BallotRunEvent> {
  static readonly inject = [Logger.key] as const;

  constructor(logger: ILogger) {
    super(logger);
  }

  protected parseRequest(request: UnknownEventBridgeEvent): Result<BallotRunEvent, Error> {
    this.logger.info({
      message: 'Parsing request',
      context: {
        request,
      },
    });
    return this.zodParseRequest(request, BallotRunEventSchema);
  }

  protected handle(event: BallotRunEvent): void {
    this.logger.info({ message: 'Handle ballot run request', context: { event } });
  }
}
