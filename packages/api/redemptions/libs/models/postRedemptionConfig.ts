import { z } from 'zod';

import { REDEMPTION_TYPES } from '@blc-mono/core/constants/redemptions';
import { createZodNamedType } from '@blc-mono/shared/utils/zodNamedType';

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
      companyId: z.union([z.string().min(1), z.number().min(1)]).transform((value) => String(value)),
      connection: z.enum(['affiliate', 'direct', 'spotify', 'none']).default('none'),
      offerId: z.union([z.string().min(1), z.number().min(1)]).transform((value) => String(value)),
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

export const PostGiftCardModel = createZodNamedType(
  'PostGiftCardModel',
  z
    .object({
      redemptionType: z.literal(REDEMPTION_TYPES[6]),
      url: z.string().url(),
    })
    .strict(),
);

export const PostVerifyModel = createZodNamedType(
  'PostVerifyModel',
  z
    .object({
      redemptionType: z.literal(REDEMPTION_TYPES[8]),
      url: z.string().url(),
    })
    .strict(),
);

export const PostCompareModel = createZodNamedType(
  'PostCompareModel',
  z
    .object({
      redemptionType: z.literal(REDEMPTION_TYPES[7]),
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
  z
    .object({
      alertBelow: z.number().positive(),
      status: z.enum(['active', 'in-active']),
      maxPerUser: z.number().positive(),
      integrationId: z
        .union([z.string(), z.number()])
        .transform((value) => String(value))
        .nullable()
        .optional(),
      email: z.string().email(),
      integration: z.enum(['eagleeye', 'uniqodo']).nullable().optional(),
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

export const BallotModel = createZodNamedType(
  'BallotModel',
  z.object({
    totalTickets: z.number().positive(),
    drawDate: z.string().datetime(),
    eventDate: z.string().datetime(),
    offerName: z.string(),
  }),
);

export type BallotModel = z.infer<typeof BallotModel>;

export const PostBallotModel = createZodNamedType(
  'PostBallotModel',
  z
    .object({
      redemptionType: z.literal(REDEMPTION_TYPES[5]),
      url: z.string().url().optional().nullable(),
      ballot: BallotModel,
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

export const PostRedemptionConfigVerifyModel = createZodNamedType(
  'PostRedemptionConfigVerifyModel',
  PostRedemptionConfigBaseModel.merge(PostVerifyModel),
);

export const PostRedemptionConfigCompareModel = createZodNamedType(
  'PostRedemptionConfigCompareModel',
  PostRedemptionConfigBaseModel.merge(PostCompareModel),
);

export const PostRedemptionConfigGiftCardModel = createZodNamedType(
  'PostRedemptionConfigGiftCardModel',
  PostRedemptionConfigBaseModel.merge(PostGiftCardModel),
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

export const PostRedemptionConfigBallotModel = createZodNamedType(
  'PostRedemptionConfigBallotModel',
  PostRedemptionConfigBaseModel.merge(PostBallotModel),
);

export const PostRedemptionConfigModel = createZodNamedType(
  'PostRedemptionConfigModel',
  z.discriminatedUnion('redemptionType', [
    PostRedemptionConfigShowCardModel,
    PostRedemptionConfigPreAppliedModel,
    PostRedemptionConfigGiftCardModel,
    PostRedemptionConfigCompareModel,
    PostRedemptionConfigGenericModel,
    PostRedemptionConfigVaultModel,
    PostRedemptionConfigVaultQRModel,
    PostRedemptionConfigVerifyModel,
    PostRedemptionConfigBallotModel,
  ]),
);

export type PostRedemptionConfigModel = z.infer<typeof PostRedemptionConfigModel>;
