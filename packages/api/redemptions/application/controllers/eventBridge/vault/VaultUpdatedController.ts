import { z } from 'zod';

import { NON_NEGATIVE_INT } from '@blc-mono/core/schemas/common';
import { eventSchema } from '@blc-mono/core/schemas/event';
import { OPTIONAL_URL_SCHEMA } from '@blc-mono/core/schemas/utility';
import { Result } from '@blc-mono/core/types/result';
import { ILogger, Logger } from '@blc-mono/core/utils/logger/logger';
import { IVaultService, VaultService } from '@blc-mono/redemptions/application/services/vault/VaultService';
import { RedemptionsDatasyncEvents } from '@blc-mono/redemptions/infrastructure/eventBridge/events/datasync';

import { EventBridgeController, UnknownEventBridgeEvent } from '../EventBridgeController';

const VaultUpdatedEventDetailSchema = z.object({
  adminEmail: z.string().email().nullable().optional(),
  alertBelow: z.number(),
  brand: z.string(),
  companyId: NON_NEGATIVE_INT,
  companyName: z.string(),
  eeCampaignId: NON_NEGATIVE_INT.nullable().optional(),
  link: OPTIONAL_URL_SCHEMA,
  linkId: NON_NEGATIVE_INT.nullable().optional(),
  managerId: NON_NEGATIVE_INT.nullable().optional(),
  maxPerUser: NON_NEGATIVE_INT,
  offerId: NON_NEGATIVE_INT,
  showQR: z.boolean(),
  ucCampaignId: NON_NEGATIVE_INT.nullable().optional(),
  vaultStatus: z.boolean(),
});
const VaultUpdatedEventSchema = eventSchema(
  RedemptionsDatasyncEvents.VAULT_UPDATED,
  z.string(),
  VaultUpdatedEventDetailSchema,
);
export type VaultUpdatedEvent = z.infer<typeof VaultUpdatedEventSchema>;
export type VaultUpdatedEventDetail = z.infer<typeof VaultUpdatedEventDetailSchema>;

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
