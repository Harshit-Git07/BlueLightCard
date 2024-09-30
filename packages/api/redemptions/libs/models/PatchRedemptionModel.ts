import { z } from 'zod';

import { RedemptionType } from '../database/schema';

export const VaultModel = z.object({
  vault: z
    .object({
      id: z.string().uuid().optional(),
      alertBelow: z.number().optional(),
      status: z.string().optional(),
      maxPerUser: z.number().optional(),
      createdAt: z.string().optional(),
      email: z.string().optional(),
      integration: z.string().optional(),
      integrationId: z.string().uuid().optional(),
    })
    .optional(),
});

export const GenericModel = z.object({
  generic: z
    .object({
      id: z.string().uuid().optional(),
      code: z.string().optional(),
    })
    .optional(),
});

export const UrlModel = z.object({
  url: z.string().optional(),
});

export const CommonModel = (redemptionType: RedemptionType) =>
  z.object({
    id: z.string(),
    redemptionType: z.literal(redemptionType),
    connection: z.enum(['affiliate', 'direct', 'spotify', 'none']).default('none').optional(),
    companyId: z.number().optional(),
    affiliate: z
      .enum([
        'awin',
        'affiliateFuture',
        'rakuten',
        'affilinet',
        'webgains',
        'partnerize',
        'impactRadius',
        'adtraction',
        'affiliateGateway',
        'optimiseMedia',
        'commissionJunction',
        'tradedoubler',
      ])
      .optional(),
  });

export const PatchShowCardModel = CommonModel('showCard');
export const PatchPreAppliedModel = CommonModel('preApplied').merge(UrlModel);
export const PatchVaultModel = CommonModel('vault').merge(UrlModel).merge(VaultModel);
export const PatchVaultQRModel = CommonModel('vaultQR').merge(UrlModel).merge(VaultModel);
export const PatchGenericModel = CommonModel('generic').merge(UrlModel).merge(GenericModel);

export const PatchRedemptionModel = z.discriminatedUnion('redemptionType', [
  PatchShowCardModel,
  PatchPreAppliedModel,
  PatchVaultModel,
  PatchVaultQRModel,
  PatchGenericModel,
]);
