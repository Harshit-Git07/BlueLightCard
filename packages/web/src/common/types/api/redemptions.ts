import { z } from 'zod';

export const RedemptionTypeSchema = z.union([
  z.literal('generic'),
  z.literal('preApplied'),
  z.literal('showCard'),
  z.literal('vault'),
  z.literal('vaultQR'),
]);
export type RedemptionType = z.infer<typeof RedemptionTypeSchema>;

export const RedemptionDetailsResponseSchema = z.object({
  data: z.object({
    redemptionType: RedemptionTypeSchema,
  }),
});
export type RedemptionDetailsResponse = z.infer<typeof RedemptionDetailsResponseSchema>;

export const RedeemDataSchema = z.object({
  redemptionType: RedemptionTypeSchema,
  redemptionDetails: z.object({
    url: z.string().optional(),
    code: z.string().optional(),
  }),
});
export const RedeemResponseSchema = z.object({
  data: RedeemDataSchema,
});
export type RedeemData = z.infer<typeof RedeemDataSchema>;
export type RedeemResponse = z.infer<typeof RedemptionDetailsResponseSchema>;
