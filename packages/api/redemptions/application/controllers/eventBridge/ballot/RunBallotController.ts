import { z } from 'zod';

import { eventSchema } from '@blc-mono/core/schemas/event';
import { Result } from '@blc-mono/core/types/result';
import { ILogger, Logger } from '@blc-mono/core/utils/logger/logger';
import { BallotService, IBallotService } from '@blc-mono/redemptions/application/services/ballot/BallotService';
import { RedemptionsBallotEvents } from '@blc-mono/redemptions/infrastructure/eventBridge/events/ballot';
import { ballotsTable } from '@blc-mono/redemptions/libs/database/schema';

import { EventBridgeController, UnknownEventBridgeEvent } from '../EventBridgeController';

export type BallotEntityWithId = { ballotId: (typeof ballotsTable.$inferSelect)['id'] };

const BallotRunEventDetailSchema = z.object({
  ballotId: z.coerce.string(),
});

const BallotRunEventSchema = eventSchema(RedemptionsBallotEvents.BALLOT_RUN, z.string(), BallotRunEventDetailSchema);
export type BallotRunEvent = z.infer<typeof BallotRunEventSchema>;

const SuccessfulBallotDetailSchema = z.object({ ballotId: z.string() });
export type SuccessfulBallotSchemaEventDetail = z.infer<typeof SuccessfulBallotDetailSchema>;

const UnsuccessfulBallotDetailSchema = z.object({ ballotId: z.string() });
export type UnsuccessfulBallotSchemaEventDetail = z.infer<typeof UnsuccessfulBallotDetailSchema>;

export class RunBallotController extends EventBridgeController<BallotRunEvent> {
  static readonly inject = [Logger.key, BallotService.key] as const;

  constructor(
    logger: ILogger,
    protected ballotService: IBallotService,
  ) {
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

  protected async handle(event: BallotRunEvent): Promise<void> {
    const dateOfRun = new Date();
    this.logger.info({ message: 'Handle ballot run request', context: { event } });
    await this.ballotService.runSingleBallot(event.detail.ballotId, dateOfRun);
  }
}
