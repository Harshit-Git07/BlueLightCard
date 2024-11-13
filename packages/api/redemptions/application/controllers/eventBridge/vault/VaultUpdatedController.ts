import { z } from 'zod';

import { eventSchema } from '@blc-mono/core/schemas/event';
import { Result } from '@blc-mono/core/types/result';
import { ILogger, Logger } from '@blc-mono/core/utils/logger/logger';
import { IVaultService, VaultService } from '@blc-mono/redemptions/application/services/vault/VaultService';
import { RedemptionsDatasyncEvents } from '@blc-mono/redemptions/infrastructure/eventBridge/events/datasync';

import { EventBridgeController, UnknownEventBridgeEvent } from '../EventBridgeController';

import { VaultEventDetailSchema } from './VaultEventDetail';

const VaultUpdatedEventSchema = eventSchema(
  RedemptionsDatasyncEvents.VAULT_UPDATED,
  z.string(),
  VaultEventDetailSchema,
);
export type VaultUpdatedEvent = z.infer<typeof VaultUpdatedEventSchema>;

export class VaultUpdatedController extends EventBridgeController<VaultUpdatedEvent> {
  static readonly inject = [Logger.key, VaultService.key] as const;

  constructor(
    logger: ILogger,
    protected vaultService: IVaultService,
  ) {
    super(logger);
  }

  protected parseRequest(request: UnknownEventBridgeEvent): Result<VaultUpdatedEvent, Error> {
    // TODO: Remove this log message after migration
    this.logger.info({
      message: 'Parsing request',
      context: {
        request,
      },
    });
    return this.zodParseRequest(request, VaultUpdatedEventSchema);
  }

  protected async handle(event: VaultUpdatedEvent): Promise<void> {
    await this.vaultService.updateVault(event);
  }
}
