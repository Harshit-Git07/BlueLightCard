import { string, z } from 'zod';

import { eventSchema } from '@blc-mono/core/schemas/event';
import { Result } from '@blc-mono/core/types/result';
import { ILogger, Logger } from '@blc-mono/core/utils/logger/logger';
import {
  EventBridgeController,
  UnknownEventBridgeEvent,
} from '@blc-mono/redemptions/application/controllers/eventBridge/EventBridgeController';
import {
  IVaultBatchService,
  VaultBatchService,
} from '@blc-mono/redemptions/application/services/email/AdminEmailService';

import { RedemptionsVaultBatchEvents } from '../../../../infrastructure/eventBridge/events/vaultBatch';

/*
 * todo: this a stub and may require further dev: https://bluelightcard.atlassian.net/browse/TR-630
 * schema based on value currently echoed into legacy admin email when vault code batch is created
 */
const VaultBatchCreatedDetailSchema = z.object({
  adminEmail: z.string().email(), //send email to admin member that uploads codes
  companyName: z.string(), //company name will require sending when vault codes are inserted
  fileName: z.string(), //name of file that the admin uploads - this is not the same as file name uploaded to S3
  countCodeInsertSuccess: z.number(), //logged as codes are inserted
  countCodeInsertFail: z.number(), //logged as codes fail to insert (duplicates, if check is required)
  codeInsertFailArray: z.array(string()), //array that is listed in email for admin info
});

const VaultBatchCreatedEventSchema = eventSchema(
  RedemptionsVaultBatchEvents.BATCH_CREATED,
  z.string(),
  VaultBatchCreatedDetailSchema,
);

export type VaultBatchCreatedEvent = z.infer<typeof VaultBatchCreatedEventSchema>;

export class VaultBatchCreatedController extends EventBridgeController<VaultBatchCreatedEvent> {
  static readonly inject = [Logger.key, VaultBatchService.key] as const;

  constructor(
    logger: ILogger,
    protected adminEmailService: IVaultBatchService,
  ) {
    super(logger);
  }

  protected parseRequest(request: UnknownEventBridgeEvent): Result<VaultBatchCreatedEvent, Error> {
    return this.zodParseRequest(request, VaultBatchCreatedEventSchema);
  }

  protected async handle(event: VaultBatchCreatedEvent): Promise<void> {
    await this.adminEmailService.vaultBatchCreated(event);
  }
}
