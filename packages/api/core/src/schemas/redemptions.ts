import { z } from "zod";
import { REDEMPTIONS_EVENT_SOURCE, REDEMPTION_TYPES, RedemptionEventDetailType } from "../constants/redemptions";
import { NON_NEGATIVE_INT } from "./common";
import { ClientTypeSchema } from "./domain";
import { eventSchema } from "./event";

// ================================== Domain ===================================

export const RedemptionTypeSchema = z.enum(REDEMPTION_TYPES);


// ================================== Events ===================================

export const MemberRedeemIntentEventDetailSchema = z.object({
  memberDetails: z.object({
    memberId: z.string(),
  }),
  redemptionDetails: z.object({
    redemptionType: RedemptionTypeSchema,
    offerId: NON_NEGATIVE_INT,
    companyId: NON_NEGATIVE_INT,
    clientType: ClientTypeSchema,
  }),
});
export type MemberRedeemIntentEventDetail = z.infer<typeof MemberRedeemIntentEventDetailSchema>;
export const MemberRedeemIntentEventSchema = eventSchema(
  REDEMPTIONS_EVENT_SOURCE,
  z.literal(RedemptionEventDetailType.MEMBER_REDEEM_INTENT),
  MemberRedeemIntentEventDetailSchema,
);
export type MemberRedeemIntentEvent = z.infer<typeof MemberRedeemIntentEventSchema>;

export const MemberRedemptionEventDetailSchema = z.object({
  memberDetails: z.object({
    memberId: z.string(),
    brazeExternalUserId: z.string(),
  }),
  redemptionDetails: z.intersection(
    z.object({
      redemptionId: z.string(),
      companyId: z.number(),
      companyName: z.string(),
      offerId: z.number(),
      offerName: z.string(),
      affiliate: z.string().nullable(),
      clientType: ClientTypeSchema,
    }),
    z.union([
      z.object({
        redemptionType: z.literal('vaultQR'),
        code: z.string(),
        url: z.string().optional()
      }),
      z.object({
        redemptionType: z.literal('vault'),
        code: z.string(),
        url: z.string(),
      }),
      z.object({
        redemptionType: z.literal('generic'),
        code: z.string(),
        url: z.string(),
      }),
      z.object({
        redemptionType: z.literal('showCard'),
      }),
      z.object({
        redemptionType: z.literal('preApplied'),
        url: z.string(),
      }),
    ])
  ),
});
export type MemberRedemptionEventDetail = z.infer<typeof MemberRedemptionEventDetailSchema>;
export const MemberRedemptionEventSchema = eventSchema(
  REDEMPTIONS_EVENT_SOURCE,
  z.literal(RedemptionEventDetailType.MEMBER_REDEMPTION),
  MemberRedemptionEventDetailSchema,
);
export type MemberRedemptionEvent = z.infer<typeof MemberRedemptionEventSchema>;

export const MemberRetrievedRedemptionDetailsEventDetailSchema = z.object({
  memberDetails: z.object({
    memberId: z.string(),
  }),
  redemptionDetails: z.object({
    redemptionType: RedemptionTypeSchema,
    companyId: z.number(),
    offerId: z.number(),
    clientType: ClientTypeSchema,
  }),
});
export type MemberRetrievedRedemptionDetailsEventDetail = z.infer<typeof MemberRetrievedRedemptionDetailsEventDetailSchema>;
export const MemberRetrievedRedemptionDetailsEventSchema = eventSchema(
  REDEMPTIONS_EVENT_SOURCE,
  z.literal(RedemptionEventDetailType.MEMBER_RETRIEVED_REDEMPTION_DETAILS),
  MemberRetrievedRedemptionDetailsEventDetailSchema,
);
export type MemberRetrievedRedemptionDetailsEvent = z.infer<typeof MemberRetrievedRedemptionDetailsEventSchema>;
