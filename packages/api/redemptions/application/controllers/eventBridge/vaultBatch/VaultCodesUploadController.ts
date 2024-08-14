import { z } from 'zod';

import { eventSchema } from '@blc-mono/core/schemas/event';
import { Result } from '@blc-mono/core/types/result';
import { ILogger, Logger } from '@blc-mono/core/utils/logger/logger';
import {
  EventBridgeController,
  UnknownEventBridgeEvent,
} from '@blc-mono/redemptions/application/controllers/eventBridge/EventBridgeController';
import {
  IVaultCodesUploadService,
  VaultCodesUploadService,
} from '@blc-mono/redemptions/application/services/vaultBatch/VaultCodesUploadService';
import { RedemptionsVaultBatchEvents } from '@blc-mono/redemptions/infrastructure/eventBridge/events/vaultBatch';

const VaultCodesUploadDetailSchema = z.object({
  bucket: z.object({
    name: z.string(),
  }),
  object: z.object({
    key: z.string(),
  }),
});

const VaultCodesUploadEventSchema = eventSchema(
  RedemptionsVaultBatchEvents.UPLOAD_SOURCE,
  z.string(),
  VaultCodesUploadDetailSchema,
);

export type VaultCodesUploadEvent = z.infer<typeof VaultCodesUploadEventSchema>;

export class VaultCodesUploadController extends EventBridgeController<VaultCodesUploadEvent> {
  static readonly inject = [Logger.key, VaultCodesUploadService.key] as const;

  constructor(
    logger: ILogger,
    protected vaultCodesUploadService: IVaultCodesUploadService,
  ) {
    super(logger);
  }

  protected parseRequest(request: UnknownEventBridgeEvent): Result<VaultCodesUploadEvent, Error> {
    return this.zodParseRequest(request, VaultCodesUploadEventSchema);
  }

  protected async handle(event: VaultCodesUploadEvent): Promise<void> {
    await this.vaultCodesUploadService.handle(event.detail.bucket.name, event.detail.object.key, 1000);
  }
}
