import { z } from 'zod';

import { eventSchema } from '@blc-mono/core/schemas/event';
import { Result } from '@blc-mono/core/types/result';
import { ILogger, Logger } from '@blc-mono/core/utils/logger/logger';
import {
  ILogVaultStockDwhService,
  LogVaultStockDwhService,
} from '@blc-mono/redemptions/application/services/vaultStock/LogVaultStockDwhService';

import { CronController, UnknownScheduledEvent } from '../CronController';

const cronEventSchema = eventSchema('aws.events', z.literal('Scheduled Event'), z.object({}));
type CronEvent = z.infer<typeof cronEventSchema>;

export class LogVaultStockDwhController extends CronController<CronEvent> {
  static readonly inject = [Logger.key, LogVaultStockDwhService.key] as const;

  constructor(
    logger: ILogger,
    protected logVaultStockDwhService: ILogVaultStockDwhService,
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
    await this.logVaultStockDwhService.logVaultStock();
  }
}
