import { z } from 'zod';

import { eventSchema } from '@blc-mono/core/schemas/event';
import { Result } from '@blc-mono/core/types/result';
import { ILogger, Logger } from '@blc-mono/core/utils/logger/logger';
import { IVaultService, VaultService } from '@blc-mono/redemptions/application/services/vault/VaultService';
import { RedemptionsDatasyncEvents } from '@blc-mono/redemptions/infrastructure/eventBridge/events/datasync';

import { EventBridgeController, UnknownEventBridgeEvent } from '../EventBridgeController';

import { VaultEventDetailSchema } from './VaultEventDetail';

const VaultCreatedEventSchema = eventSchema(
  RedemptionsDatasyncEvents.VAULT_CREATED,
  z.string(),
  VaultEventDetailSchema,
);

export type VaultCreatedEvent = z.infer<typeof VaultCreatedEventSchema>;

export class VaultCreatedController extends EventBridgeController<VaultCreatedEvent> {
  static readonly inject = [Logger.key, VaultService.key] as const;

  constructor(
    logger: ILogger,
    protected vaultService: IVaultService,
  ) {
    super(logger);
  }

  protected parseRequest(request: UnknownEventBridgeEvent): Result<VaultCreatedEvent, Error> {
    // TODO: Remove this log message after migration
    this.logger.info({
      message: 'Parsing request',
      context: {
        request,
      },
    });
    return this.zodParseRequest(request, VaultCreatedEventSchema);
  }

  protected async handle(event: VaultCreatedEvent): Promise<void> {
    await this.vaultService.createVault(event);
  }
}
