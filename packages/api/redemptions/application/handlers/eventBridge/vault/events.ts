import { z } from 'zod';

import { NON_NEGATIVE_INT } from '@blc-mono/core/schemas/common';
import { PLATFORM_SCHEMA } from '@blc-mono/core/schemas/domain';
import { eventSchema } from '@blc-mono/core/schemas/event';
import { RedemptionsDatasyncEvents } from '@blc-mono/redemptions/infrastructure/eventBridge/events/datasync';

export const VaultCreatedEventSchema = eventSchema(
  RedemptionsDatasyncEvents.VAULT_CREATED,
  z.string(),
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
);
export type VaultCreatedEvent = z.infer<typeof VaultCreatedEventSchema>;
export type VaultCreatedEventDetail = VaultCreatedEvent['detail'];

export const VaultUpdatedEventSchema = eventSchema(RedemptionsDatasyncEvents.VAULT_UPDATED, z.string(), z.object({}));
export type VaultUpdatedEvent = z.infer<typeof VaultUpdatedEventSchema>;
export type VaultUpdatedEventDetail = VaultUpdatedEvent['detail'];
