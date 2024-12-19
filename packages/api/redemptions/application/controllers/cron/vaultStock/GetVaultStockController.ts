import { z } from 'zod';

import { eventSchema } from '@blc-mono/core/schemas/event';
import { Result } from '@blc-mono/core/types/result';
import { ILogger, Logger } from '@blc-mono/core/utils/logger/logger';
import {
  GetVaultStockService,
  IGetVaultStockService,
} from '@blc-mono/redemptions/application/services/vaultStock/GetVaultStockService';

import { CronController, UnknownScheduledEvent } from '../CronController';

const cronEventSchema = eventSchema('aws.events', z.literal('Scheduled Event'), z.object({}));
type CronEvent = z.infer<typeof cronEventSchema>;

export class GetVaultStockController extends CronController<CronEvent> {
  static readonly inject = [Logger.key, GetVaultStockService.key] as const;

  constructor(
    logger: ILogger,
    protected getVaultStockService: IGetVaultStockService,
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

  protected handle(event: UnknownScheduledEvent): void {
    this.logger.info({ message: 'Handle event', context: { event } });
    this.getVaultStockService.getVaultStock();
  }
}
