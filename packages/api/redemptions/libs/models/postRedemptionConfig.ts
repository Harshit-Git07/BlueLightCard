import { z } from 'zod';

import { REDEMPTION_TYPES } from '@blc-mono/core/constants/redemptions';
import { createZodNamedType } from '@blc-mono/core/extensions/apiGatewayExtension/agModelGenerator';

export const PostRedemptionConfigBaseModel = createZodNamedType(
  'PostRedemptionConfigBaseModel',
  z
    .object({
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
        .optional()
        .nullable(),
      companyId: z.coerce.number().positive(),
      connection: z.enum(['affiliate', 'direct', 'spotify', 'none']).default('none'),
      offerId: z.coerce.string(),
    })
    .strict(),
);

export const PostShowCardModel = createZodNamedType(
  'PostShowCardModel',
  z
    .object({
      redemptionType: z.literal(REDEMPTION_TYPES[3]),
    })
    .strict(),
);

export const PostPreAppliedModel = createZodNamedType(
  'PostPreAppliedModel',
  z
    .object({
      redemptionType: z.literal(REDEMPTION_TYPES[4]),
      url: z.string().url(),
    })
    .strict(),
);

export const PostGenericModel = createZodNamedType(
  'PostGenericModel',
  z
    .object({
      redemptionType: z.literal(REDEMPTION_TYPES[0]),
      url: z.string().url(),
      generic: z.object({
        code: z.string().min(1),
      }),
    })
    .strict(),
);

export const VaultModel = createZodNamedType(
  'VaultModel',
  z.object({
    alertBelow: z.number().positive(),
    status: z.enum(['active', 'in-active']),
    maxPerUser: z.number().positive(),
    integrationId: z.number().nullable(),
    email: z.string().email(),
    integration: z.enum(['eagleeye', 'uniqodo']).nullable(),
  }),
);

export type VaultModel = z.infer<typeof VaultModel>;

export const PostVaultModel = createZodNamedType(
  'PostVaultModel',
  z
    .object({
      redemptionType: z.literal(REDEMPTION_TYPES[1]),
      url: z.string().url(),
      vault: VaultModel,
    })
    .strict(),
);

export const PostVaultQRModel = createZodNamedType(
  'PostVaultModel',
  z
    .object({
      redemptionType: z.literal(REDEMPTION_TYPES[2]),
      vault: VaultModel,
    })
    .strict(),
);

export const PostRedemptionConfigShowCardModel = createZodNamedType(
  'PostRedemptionConfigShowCardModel',
  PostRedemptionConfigBaseModel.merge(PostShowCardModel),
);

export const PostRedemptionConfigPreAppliedModel = createZodNamedType(
  'PostRedemptionConfigPreAppliedModel',
  PostRedemptionConfigBaseModel.merge(PostPreAppliedModel),
);

export const PostRedemptionConfigGenericModel = createZodNamedType(
  'PostRedemptionConfigGenericModel',
  PostRedemptionConfigBaseModel.merge(PostGenericModel),
);

export const PostRedemptionConfigVaultModel = createZodNamedType(
  'PostRedemptionConfigVaultModel',
  PostRedemptionConfigBaseModel.merge(PostVaultModel),
);

export const PostRedemptionConfigVaultQRModel = createZodNamedType(
  'PostRedemptionConfigVaultQRModel',
  PostRedemptionConfigBaseModel.merge(PostVaultQRModel),
);

export const PostRedemptionConfigModel = createZodNamedType(
  'PostRedemptionConfigModel',
  z.discriminatedUnion('redemptionType', [
    PostRedemptionConfigShowCardModel,
    PostRedemptionConfigPreAppliedModel,
    PostRedemptionConfigGenericModel,
    PostRedemptionConfigVaultModel,
    PostRedemptionConfigVaultQRModel,
  ]),
);

export type PostRedemptionConfigModel = z.infer<typeof PostRedemptionConfigModel>;
