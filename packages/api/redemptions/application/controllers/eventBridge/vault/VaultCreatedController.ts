import { z } from 'zod';

import { NON_NEGATIVE_INT } from '@blc-mono/core/schemas/common';
import { PLATFORM_SCHEMA } from '@blc-mono/core/schemas/domain';
import { eventSchema } from '@blc-mono/core/schemas/event';
import { Result } from '@blc-mono/core/types/result';
import { ILogger, Logger } from '@blc-mono/core/utils/logger/logger';
import { IVaultService, VaultService } from '@blc-mono/redemptions/application/services/vault/VaultService';
import { RedemptionsDatasyncEvents } from '@blc-mono/redemptions/infrastructure/eventBridge/events/datasync';

import { EventBridgeController, UnknownEventBridgeEvent } from '../EventBridgeController';

const VaultCreatedEventDetailSchema = z.object({
  adminEmail: z.string().email().nullable().optional(),
  alertBelow: z.number(),
  brand: z.string(),
  companyId: NON_NEGATIVE_INT,
  companyName: z.string(),
  eeCampaignId: NON_NEGATIVE_INT.nullable().optional(),
  link: z.string().url().nullable().optional(),
  linkId: NON_NEGATIVE_INT.nullable().optional(),
  managerId: NON_NEGATIVE_INT.nullable().optional(),
  maxPerUser: NON_NEGATIVE_INT,
  offerId: NON_NEGATIVE_INT,
  platform: PLATFORM_SCHEMA,
  showQR: z.boolean(),
  terms: z.string(),
  ucCampaignId: NON_NEGATIVE_INT.nullable().optional(),
  vaultStatus: z.boolean(),
});
const VaultCreatedEventSchema = eventSchema(
  RedemptionsDatasyncEvents.VAULT_CREATED,
  z.string(),
  VaultCreatedEventDetailSchema,
);
export type VaultCreatedEvent = z.infer<typeof VaultCreatedEventSchema>;
export type VaultCreatedEventDetail = z.infer<typeof VaultCreatedEventDetailSchema>;

export class VaultCreatedController extends EventBridgeController<VaultCreatedEvent> {
  static readonly inject = [Logger.key, VaultService.key] as const;

  constructor(
    protected logger: ILogger,
    protected vaultService: IVaultService,
  ) {
    super();
  }

  protected parseRequest(request: UnknownEventBridgeEvent): Result<VaultCreatedEvent, Error> {
    return this.zodParseRequest(request, VaultCreatedEventSchema);
  }

  protected async handle(event: VaultCreatedEvent): Promise<void> {
    await this.vaultService.createVault(event);
  }
}
