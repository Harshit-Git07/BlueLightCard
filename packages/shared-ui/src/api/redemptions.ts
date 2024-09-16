import { z } from 'zod';
import type { IPlatformAdapter } from '../adapters';
import { RedemptionType } from '../utils/redemptionTypes';
import { Messages } from '../utils/messages';

const RedemptionTypeSchema = z.union([
  z.literal(RedemptionType.GENERIC),
  z.literal(RedemptionType.PRE_APPLIED),
  z.literal(RedemptionType.SHOW_CARD),
  z.literal(RedemptionType.VAULT),
  z.literal(RedemptionType.VAULT_QR),
]);

export async function getRedemptionDetails(platformAdapter: IPlatformAdapter, offerId: number) {
  const result = await platformAdapter.invokeV5Api('/eu/redemptions/member/redemptionDetails', {
    method: 'GET',
    queryParameters: {
      offerId: offerId.toString(),
    },
  });

  if (result.status !== 200) {
    throw new Error(Messages.UNABLE_RETRIEVE_REDEMPTION_DETAILS);
  }

  return JSON.parse(result.data);
}

export const RedeemResultKind = {
  MaxPerUserReached: 'MaxPerUserReached',
  OK: 'Ok',
} as const;

export const RedeemDataSchema = z.object({
  redemptionType: RedemptionTypeSchema,
  redemptionDetails: z.object({
    url: z.string().optional(),
    code: z.string().optional(),
  }),
});
export const RedeemDataMessage = z.object({
  message: z.string().optional(),
});
export const RedeemData = z.union([RedeemDataSchema, RedeemDataMessage]);
export const RedeemResponseDataSchema = z.object({
  kind: z.string(),
  redemptionType: RedemptionTypeSchema,
  redemptionDetails: z.object({
    url: z.string().optional(),
    code: z.string().optional(),
  }),
});

export const RedeemResponseWithMessage = z.object({
  kind: z.string(),
  message: z.string(),
});

export const RedeemResponseSchema = z.object({
  data: z.union([RedeemResponseDataSchema, RedeemResponseWithMessage]),
  statusCode: z.number(),
});

export type RedeemResponse = z.infer<typeof RedeemResponseSchema>;
export type RedeemData = z.infer<typeof RedeemData>;
export type RedeemDataMessage = z.infer<typeof RedeemDataMessage>;

export type RedeemDataStateData = {
  state: (typeof RedeemResultKind)[keyof typeof RedeemResultKind];
  data: RedeemData;
};

export const isRedeemDataErrorResponse = (data: RedeemData): data is RedeemDataMessage => {
  return 'message' in data;
};

export async function redeemOffer(
  platformAdapter: IPlatformAdapter,
  offerId: number,
  offerName: string,
  companyName: string,
) {
  const result = await platformAdapter.invokeV5Api('/eu/redemptions/member/redeem', {
    method: 'POST',
    body: JSON.stringify({
      offerId,
      offerName,
      companyName,
    }),
  });

  if (result.status !== 200) {
    throw new Error(Messages.UNABLE_REDEEM_OFFER);
  }

  const { data } = RedeemResponseSchema.parse(JSON.parse(result.data));

  if ('message' in data) {
    throw new Error(data.message);
  }

  return data;
}
