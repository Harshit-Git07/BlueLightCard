import { z } from 'zod';

import { createZodNamedType } from '@blc-mono/core/extensions/apiGatewayExtension/agModelGenerator';

export const PatchGenericModel = z.object({
  id: z.string().uuid(),
  code: z.string(),
});

export const PatchVaultModel = z.object({
  id: z.string().uuid(),
  alertBelow: z.number(),
  status: z.string(),
  redemptionType: z.string(),
  maxPerUser: z.number(),
  createdAt: z.string(),
  email: z.string(),
  integration: z.string(),
  integrationId: z.string().uuid(),
});

const modelUnion = z.union([PatchVaultModel, PatchGenericModel]);
const PatchSpecificProps = z.object({
  id: z.string(),
  offerId: z.string(),
  connections: z.string(),
  affiliate: z.string(),
  url: z.string().optional(),
});

const PatchRedemptionModelIntersection = z.intersection(
  PatchSpecificProps,
  z.record(z.union([PatchVaultModel, PatchGenericModel])),
);
export const PatchRedemptionModel = createZodNamedType('PatchRedemptionModel', PatchRedemptionModelIntersection);

export type PatchVaultModel = z.infer<typeof PatchVaultModel>;
export type PatchGenericModel = z.infer<typeof PatchGenericModel>;
export type PostRedemptionModel = z.infer<typeof PatchRedemptionModel>;
export type PatchModelUnion = z.infer<typeof modelUnion>;
