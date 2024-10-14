import { z } from 'zod';

export type IntegrationType = 'uniqodo' | 'eagleeye';

// We use this to ensure that all fields are required but allow for any type
const anyRequired = z.any().superRefine((data, ctx) => {
  if (data === undefined) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Field cannot be undefined',
    });
  }
});

export const UniqodoModelSchema = z.object({
  integrationType: z.literal('uniqodo'),
  claim: z.object({
    expiresAt: anyRequired,
    code: anyRequired,
    createdAt: anyRequired,
    deactivatedAt: anyRequired,
    linkedUniqueReference: anyRequired,
    promotionId: anyRequired,
  }),
  promotion: z.object({
    id: anyRequired,
    status: anyRequired,
    codeType: anyRequired,
    timezone: anyRequired,
    redemptionsPerCode: anyRequired,
    title: anyRequired,
    rewardType: anyRequired,
    reward: z.object({
      type: anyRequired,
      amount: anyRequired,
      discountType: anyRequired,
      upToMaximumOf: anyRequired,
      productExclusionRule: anyRequired,
    }),
    availableToClaim: anyRequired,
    availableToRedeem: anyRequired,
    startDate: anyRequired,
    endDate: anyRequired,
    terms: anyRequired,
    codeExpiry: anyRequired,
    codeExpiryUnit: anyRequired,
  }),
  customer: anyRequired,
});

export const EagleEyeModelSchema = z.object({
  integrationType: z.literal('eagleeye'),
  accountId: anyRequired,
  accountStatus: anyRequired,
  accountTypeId: anyRequired,
  accountTransactionId: anyRequired,
  accountType: anyRequired,
  accountSubType: anyRequired,
  balances: z.object({
    available: anyRequired,
    refundable: anyRequired,
  }),
  issuerId: anyRequired,
  resourceId: anyRequired,
  resourceType: anyRequired,
  token: anyRequired,
  tokenDates: z.object({
    start: anyRequired,
    end: anyRequired,
  }),
  tokenId: anyRequired,
  tokenStatus: anyRequired,
  consumerId: anyRequired,
});

export type UniqodoModel = z.infer<typeof UniqodoModelSchema>;
export type EagleEyeModel = z.infer<typeof EagleEyeModelSchema>;
export const PostCallbackModel = z.discriminatedUnion('integrationType', [UniqodoModelSchema, EagleEyeModelSchema]);
