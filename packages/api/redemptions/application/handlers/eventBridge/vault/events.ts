import { z } from 'zod';

import { NON_NEGATIVE_INT } from '@blc-mono/core/schemas/common';
import { PLATFORM_SCHEMA } from '@blc-mono/core/schemas/domain';
import { EventSchema, eventSchema } from '@blc-mono/core/schemas/event';

export enum VaultEvents {
  VAULT_CREATED = 'vault.created',
  VAULT_UPDATED = 'vault.updated',
}

export const VaultEventSchema = {
  [VaultEvents.VAULT_CREATED]: eventSchema(
    VaultEvents.VAULT_CREATED,
    z.object({
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
    }),
  ),
  [VaultEvents.VAULT_UPDATED]: eventSchema(VaultEvents.VAULT_UPDATED, z.object({})),
} satisfies Record<VaultEvents, EventSchema>;

export const VaultCreatedEventSchema = VaultEventSchema[VaultEvents.VAULT_CREATED];
export type VaultCreatedEvent = z.infer<typeof VaultCreatedEventSchema>;
export type VaultCreatedEventDetail = VaultCreatedEvent['detail'];

export const VaultUpdatedEventSchema = VaultEventSchema[VaultEvents.VAULT_UPDATED];
export type VaultUpdatedEvent = z.infer<typeof VaultUpdatedEventSchema>;
export type VaultUpdatedEventDetail = VaultUpdatedEvent['detail'];
