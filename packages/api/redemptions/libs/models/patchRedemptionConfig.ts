import { z } from 'zod';

import { RedemptionType } from '../database/schema';

export const VaultModel = z.object({
  vault: z.object({
    id: z.string(),
    alertBelow: z.number(),
    status: z.enum(['active', 'in-active']),
    maxPerUser: z.number(),
    email: z.string().email(),
    integration: z.string().nullable(),
    integrationId: z.string().nullable(),
  }),
});

export const GenericModel = z.object({
  generic: z.object({
    id: z.string(),
    code: z.string(),
  }),
});

export const UrlModel = z.object({
  url: z.string().url(),
});

export const CommonModel = (redemptionType: RedemptionType) =>
  z.object({
    id: z.string(),
    redemptionType: z.literal(redemptionType),
    connection: z.enum(['affiliate', 'direct', 'spotify', 'none']).default('none'),
    offerId: z.coerce.string(),
    companyId: z.coerce.number().positive(),
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
      .nullable(),
  });

export const PatchShowCardModel = CommonModel('showCard');
export const PatchPreAppliedModel = CommonModel('preApplied').merge(UrlModel);
export const PatchVaultModel = CommonModel('vault').merge(UrlModel).merge(VaultModel);
export const PatchVaultQRModel = CommonModel('vaultQR').merge(VaultModel);
export const PatchGenericModel = CommonModel('generic').merge(UrlModel).merge(GenericModel);

export const PatchVaultOrVaultQRModel = z.union([PatchVaultModel, PatchVaultQRModel]);

export const PatchRedemptionConfigModel = z.discriminatedUnion('redemptionType', [
  PatchShowCardModel,
  PatchPreAppliedModel,
  PatchVaultModel,
  PatchVaultQRModel,
  PatchGenericModel,
]);
