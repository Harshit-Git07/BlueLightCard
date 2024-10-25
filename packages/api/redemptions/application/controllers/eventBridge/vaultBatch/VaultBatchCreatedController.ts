import { z } from 'zod';

import { eventSchema } from '@blc-mono/core/schemas/event';
import { Result } from '@blc-mono/core/types/result';
import { ILogger, Logger } from '@blc-mono/core/utils/logger/logger';
import {
  EventBridgeController,
  UnknownEventBridgeEvent,
} from '@blc-mono/redemptions/application/controllers/eventBridge/EventBridgeController';
import {
  IVaultBatchCreatedService,
  VaultBatchCreatedService,
} from '@blc-mono/redemptions/application/services/vaultBatch/VaultBatchCreatedService';

import { RedemptionsVaultBatchEvents } from '../../../../infrastructure/eventBridge/events/vaultBatch';

const VaultBatchCreatedDetailSchema = z.object({
  vaultId: z.string(),
  batchId: z.string(),
  fileName: z.string(), //name of file that the admin uploads - this is not the same as file name uploaded to S3
  numberOfCodeInsertSuccesses: z.number(), //logged as codes are inserted
  numberOfCodeInsertFailures: z.number(), //logged as codes fail to insert (duplicates, if check is required)
  codeInsertFailArray: z.array(z.string()), //array that is listed in email for admin info
  numberOfDuplicateCodes: z.number(), //logged as duplicate codes are found
});

const VaultBatchCreatedEventSchema = eventSchema(
  RedemptionsVaultBatchEvents.BATCH_CREATED,
  z.string(),
  VaultBatchCreatedDetailSchema,
);

export type VaultBatchCreatedEvent = z.infer<typeof VaultBatchCreatedEventSchema>;
export type VaultBatchCreatedEventDetail = z.infer<typeof VaultBatchCreatedDetailSchema>;

export class VaultBatchCreatedController extends EventBridgeController<VaultBatchCreatedEvent> {
  static readonly inject = [Logger.key, VaultBatchCreatedService.key] as const;

  constructor(
    logger: ILogger,
    protected vaultBatchCreatedService: IVaultBatchCreatedService,
  ) {
    super(logger);
  }

  protected parseRequest(request: UnknownEventBridgeEvent): Result<VaultBatchCreatedEvent, Error> {
    return this.zodParseRequest(request, VaultBatchCreatedEventSchema);
  }

  protected async handle(event: VaultBatchCreatedEvent): Promise<void> {
    await this.vaultBatchCreatedService.vaultBatchCreated(event);
  }
}
