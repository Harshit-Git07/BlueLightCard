import { z } from 'zod';

import { REDEMPTION_TYPES } from '@blc-mono/core/constants/redemptions';
import { createZodNamedType } from '@blc-mono/core/extensions/apiGatewayExtension/agModelGenerator';

export const PatchRedemptionConfigBaseModel = createZodNamedType(
  'PatchRedemptionConfigBaseModel',
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
      id: z.string(),
      companyId: z.union([z.string().min(1), z.number().min(1)]).transform((value) => String(value)),
      connection: z.enum(['affiliate', 'direct', 'spotify', 'none']).default('none'),
      offerId: z.union([z.string().min(1), z.number().min(1)]).transform((value) => String(value)),
    })
    .strict(),
);

export const PatchShowCardModel = createZodNamedType(
  'PatchShowCardModel',
  z
    .object({
      redemptionType: z.literal(REDEMPTION_TYPES[3]),
    })
    .strict(),
);

export const PatchPreAppliedModel = createZodNamedType(
  'PatchPreAppliedModel',
  z
    .object({
      redemptionType: z.literal(REDEMPTION_TYPES[4]),
      url: z.string().url(),
    })
    .strict(),
);

export const PatchGiftCardModel = createZodNamedType(
  'PatchGiftCardModel',
  z
    .object({
      redemptionType: z.literal(REDEMPTION_TYPES[6]),
      url: z.string().url(),
    })
    .strict(),
);

export const PatchCompareModel = createZodNamedType(
  'PatchCompareModel',
  z
    .object({
      redemptionType: z.literal(REDEMPTION_TYPES[7]),
      url: z.string().url(),
    })
    .strict(),
);

export const PatchVerifyModel = createZodNamedType(
  'PatchVerifyModel',
  z
    .object({
      redemptionType: z.literal(REDEMPTION_TYPES[8]),
      url: z.string().url(),
    })
    .strict(),
);

export const PatchGenericModel = createZodNamedType(
  'PatchGenericModel',
  z
    .object({
      redemptionType: z.literal(REDEMPTION_TYPES[0]),
      url: z.string().url(),
      generic: z.object({
        id: z.string(),
        code: z.string().min(1),
      }),
    })
    .strict(),
);

export const VaultModel = createZodNamedType(
  'VaultModel',
  z
    .object({
      id: z.string(),
      alertBelow: z.number(),
      status: z.enum(['active', 'in-active']),
      maxPerUser: z.number(),
      email: z.string().email(),
      integration: z.enum(['eagleeye', 'uniqodo']).nullable().optional(),
      integrationId: z.string().nullable().optional(),
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

export const PatchVaultModel = createZodNamedType(
  'PatchVaultModel',
  z
    .object({
      redemptionType: z.literal(REDEMPTION_TYPES[1]),
      url: z.string().url(),
      vault: VaultModel,
    })
    .strict(),
);

export const PatchVaultQRModel = createZodNamedType(
  'PatchVaultModel',
  z
    .object({
      redemptionType: z.literal(REDEMPTION_TYPES[2]),
      vault: VaultModel,
    })
    .strict(),
);

export const PatchRedemptionConfigShowCardModel = createZodNamedType(
  'PatchRedemptionConfigShowCardModel',
  PatchRedemptionConfigBaseModel.merge(PatchShowCardModel),
);

export const PatchRedemptionConfigPreAppliedModel = createZodNamedType(
  'PatchRedemptionConfigPreAppliedModel',
  PatchRedemptionConfigBaseModel.merge(PatchPreAppliedModel),
);

export const PatchRedemptionConfigGenericModel = createZodNamedType(
  'PatchRedemptionConfigGenericModel',
  PatchRedemptionConfigBaseModel.merge(PatchGenericModel),
);

export const PatchRedemptionConfigVaultModel = createZodNamedType(
  'PatchRedemptionConfigVaultModel',
  PatchRedemptionConfigBaseModel.merge(PatchVaultModel),
);

export const PatchRedemptionConfigVaultQRModel = createZodNamedType(
  'PatchRedemptionConfigVaultQRModel',
  PatchRedemptionConfigBaseModel.merge(PatchVaultQRModel),
);

export const PatchRedemptionConfigGiftCardModel = createZodNamedType(
  'PatchRedemptionConfigGiftCardModel',
  PatchRedemptionConfigBaseModel.merge(PatchGiftCardModel),
);

export const PatchRedemptionConfigCompareModel = createZodNamedType(
  'PatchRedemptionConfigCompareModel',
  PatchRedemptionConfigBaseModel.merge(PatchCompareModel),
);

export const PatchRedemptionConfigVerifyModel = createZodNamedType(
  'PatchRedemptionConfigVerifyModel',
  PatchRedemptionConfigBaseModel.merge(PatchVerifyModel),
);

export const BallotModelForPatch = createZodNamedType(
  'BallotModel',
  z.object({
    id: z.string(),
    totalTickets: z.number().positive(),
    drawDate: z.string().datetime(),
    eventDate: z.string().datetime(),
    offerName: z.string(),
  }),
);

export type BallotModel = z.infer<typeof BallotModelForPatch>;

export const PatchBallotModel = createZodNamedType(
  'PatchBallotModel',
  z
    .object({
      redemptionType: z.literal(REDEMPTION_TYPES[5]),
      url: z.string().url(),
      ballot: BallotModelForPatch,
    })
    .strict(),
);

export const PatchRedemptionConfigBallotModel = createZodNamedType(
  'PatchRedemptionConfigBallotModel',
  PatchRedemptionConfigBaseModel.merge(PatchBallotModel),
);

export const PatchRedemptionConfigModel = createZodNamedType(
  'PatchRedemptionConfigModel',
  z.discriminatedUnion('redemptionType', [
    PatchRedemptionConfigShowCardModel,
    PatchRedemptionConfigPreAppliedModel,
    PatchRedemptionConfigGenericModel,
    PatchRedemptionConfigVaultModel,
    PatchRedemptionConfigVaultQRModel,
    PatchRedemptionConfigGiftCardModel,
    PatchRedemptionConfigCompareModel,
    PatchRedemptionConfigVerifyModel,
    PatchRedemptionConfigBallotModel,
  ]),
);

export type PatchRedemptionConfigModel = z.infer<typeof PatchRedemptionConfigModel>;
export type PatchRedemptionConfigShowCardModel = z.infer<typeof PatchRedemptionConfigShowCardModel>;
export type PatchRedemptionConfigPreAppliedModel = z.infer<typeof PatchRedemptionConfigPreAppliedModel>;
export type PatchRedemptionConfigGenericModel = z.infer<typeof PatchRedemptionConfigGenericModel>;
export type PatchRedemptionConfigVaultModel = z.infer<typeof PatchRedemptionConfigVaultModel>;
export type PatchRedemptionConfigVaultQRModel = z.infer<typeof PatchRedemptionConfigVaultQRModel>;
export type PatchRedemptionConfigGiftCardModel = z.infer<typeof PatchRedemptionConfigGiftCardModel>;
export type PatchRedemptionConfigCompareModel = z.infer<typeof PatchRedemptionConfigCompareModel>;
export type PatchRedemptionConfigVerifyModel = z.infer<typeof PatchRedemptionConfigVerifyModel>;
export type PatchRedemptionConfigBallotModel = z.infer<typeof PatchRedemptionConfigBallotModel>;
