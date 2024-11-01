import { z } from 'zod';

import { RedemptionType } from '../database/schema';

export const VaultModel = z.object({
  vault: z
    .object({
      id: z.string(),
      alertBelow: z.number(),
      status: z.enum(['active', 'in-active']),
      maxPerUser: z.number(),
      email: z.string().email(),
      integration: z.enum(['eagleeye', 'uniqodo']).nullable(),
      integrationId: z.string().nullable(),
    })
    .superRefine((val, ctx) => {
      if ((val.integration === 'eagleeye' || val.integration === 'uniqodo') && !val.integrationId) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'integrationId must be provided when integration is eagleeye or uniqodo',
          fatal: true,
        });
        return z.NEVER;
      }
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
    offerId: z.union([z.string(), z.number()]).transform((value) => String(value)),
    companyId: z.union([z.string(), z.number()]).transform((value) => String(value)),
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
