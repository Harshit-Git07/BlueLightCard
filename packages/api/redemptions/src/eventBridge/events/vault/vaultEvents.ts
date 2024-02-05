import { z } from 'zod';

import { NUMERIC_ID_SCHEMA } from '../../../schemas/common';
import { PLATFORM_SCHEMA } from '../../../schemas/domain';
import { EventSchema, eventSchema } from '../../schemas/event';

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
      companyId: NUMERIC_ID_SCHEMA,
      companyName: z.string(),
      eeCampaignId: NUMERIC_ID_SCHEMA.nullable().optional(),
      link: z.string().url().nullable().optional(),
      linkId: NUMERIC_ID_SCHEMA.nullable().optional(),
      managerId: NUMERIC_ID_SCHEMA.nullable().optional(),
      maxPerUser: NUMERIC_ID_SCHEMA,
      offerId: NUMERIC_ID_SCHEMA,
      platform: PLATFORM_SCHEMA,
      showQR: z.boolean(),
      terms: z.string(),
      ucCampaignId: NUMERIC_ID_SCHEMA.nullable().optional(),
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
