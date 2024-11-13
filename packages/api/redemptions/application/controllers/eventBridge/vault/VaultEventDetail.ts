import { z } from 'zod';

import { NON_NEGATIVE_INT } from '@blc-mono/core/schemas/common';
import { OPTIONAL_URL_SCHEMA } from '@blc-mono/core/schemas/utility';

export const VaultEventDetailSchema = z.object({
  adminEmail: z.string().email().nullable().optional(),
  alertBelow: z.number(),
  brand: z.string(),
  companyId: z.coerce.string(),
  companyName: z.string(),
  eeCampaignId: z.coerce.string().nullable().optional(),
  link: OPTIONAL_URL_SCHEMA,
  linkId: NON_NEGATIVE_INT.nullable().optional(),
  managerId: NON_NEGATIVE_INT.nullable().optional(),
  maxPerUser: NON_NEGATIVE_INT,
  offerId: z.coerce.string(),
  showQR: z.boolean(),
  ucCampaignId: z.coerce.string().nullable().optional(),
  vaultStatus: z.boolean(),
});

export type VaultEventDetail = z.infer<typeof VaultEventDetailSchema>;
