import { z } from 'zod';

import { NON_NEGATIVE_INT } from '@blc-mono/core/schemas/common';
import { eventSchema } from '@blc-mono/core/schemas/event';
import { Result } from '@blc-mono/core/types/result';
import { ILogger, Logger } from '@blc-mono/core/utils/logger/logger';
import { IVaultService, VaultService } from '@blc-mono/redemptions/application/services/vault/VaultService';
import { RedemptionsDatasyncEvents } from '@blc-mono/redemptions/infrastructure/eventBridge/events/datasync';

import { EventBridgeController, UnknownEventBridgeEvent } from '../EventBridgeController';

const VaultUpdatedEventDetailSchema = z.object({
  sk: z.string(),
  alertBelow: z.number(),
  brand: z.string(),
  companyId: NON_NEGATIVE_INT,
  companyName: z.string(),
  eeCampaignId: NON_NEGATIVE_INT.nullable().optional(),
  link: z.string().url().nullable().optional(),
  linkId: NON_NEGATIVE_INT.nullable().optional(),
  email: z.string().email().nullable().optional(),
  maxPerUser: NON_NEGATIVE_INT,
  offerId: NON_NEGATIVE_INT,
  showQR: z.boolean(),
  terms: z.string(),
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

  constructor(protected logger: ILogger, protected vaultService: IVaultService) {
    super();
  }

  protected parseRequest(request: UnknownEventBridgeEvent): Result<VaultUpdatedEvent, Error> {
    return this.zodParseRequest(request, VaultUpdatedEventSchema);
  }

  protected async handle(event: VaultUpdatedEvent): Promise<void> {
    await this.vaultService.updateVault(event);
  }
}
