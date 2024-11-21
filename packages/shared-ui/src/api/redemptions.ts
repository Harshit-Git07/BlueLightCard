import { z } from 'zod';
import { IPlatformAdapter } from '../adapters';
import { RedemptionTypeSchema } from '../components/OfferSheet/types';

export async function getRedemptionDetails(
  platformAdapter: IPlatformAdapter,
  offerId: number | string,
) {
  const result = await platformAdapter.invokeV5Api('/eu/redemptions/member/redemptionDetails', {
    method: 'GET',
    queryParameters: {
      offerId: offerId.toString(),
    },
  });

  if (result.status !== 200) {
    throw new Error('Unable to retrieve redemption details');
  }

  return JSON.parse(result.data);
}

export const RedeemResultKind = {
  MaxPerUserReached: 'MaxPerUserReachedError',
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
  ...RedeemDataSchema.shape,
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
): Promise<RedeemDataStateData | Error> {
  const result = await platformAdapter.invokeV5Api('/eu/redemptions/member/redeem', {
    method: 'POST',
    body: JSON.stringify({
      offerId,
      offerName,
      companyName,
    }),
  });

  const resultData = JSON.parse(result.data);
  const body = RedeemResponseSchema.safeParse(resultData);

  if (!body.success) {
    throw new Error('Unable to redeem offer');
  }

  const { kind } = body.data.data;
  const {
    data: { data },
  } = body;

  switch (kind) {
    case RedeemResultKind.MaxPerUserReached:
      return {
        state: RedeemResultKind.MaxPerUserReached,
        data,
      };
    case RedeemResultKind.OK:
      return {
        state: RedeemResultKind.OK,
        data,
      };
    default:
      throw new Error('Unable to redeem offer');
  }
}
