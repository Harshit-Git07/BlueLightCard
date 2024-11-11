import { z } from 'zod';

import { eventSchema } from '@blc-mono/core/schemas/event';
import { Result } from '@blc-mono/core/types/result';
import { ILogger, Logger } from '@blc-mono/core/utils/logger/logger';

import { CronController, UnknownScheduledEvent } from '../CronController';

const cronEventSchema = eventSchema('aws.events', z.literal('Scheduled Event'), z.object({}));
type CronEvent = z.infer<typeof cronEventSchema>;

export class CheckBallotsController extends CronController<CronEvent> {
  static readonly inject = [Logger.key] as const;

  constructor(logger: ILogger) {
    super(logger);
  }

  protected parseRequest(request: UnknownScheduledEvent): Result<CronEvent, Error> {
    return this.zodParseRequest(request, cronEventSchema);
  }

  protected handle(event: UnknownScheduledEvent): void {
    this.logger.info({ message: 'Handle event', context: { event } });
  }
}
