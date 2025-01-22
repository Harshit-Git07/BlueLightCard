import { ProfileModel } from '@blc-mono/shared/models/members/profileModel';
import { ApplicationModel } from '@blc-mono/shared/models/members/applicationModel';
import { CardModel } from '@blc-mono/shared/models/members/cardModel';
import { ApplicationReason } from '@blc-mono/shared/models/members/enums/ApplicationReason';
import { RejectionReason } from '@blc-mono/shared/models/members/enums/RejectionReason';
import { EligibilityStatus } from '@blc-mono/shared/models/members/enums/EligibilityStatus';
import { PaymentStatus } from '@blc-mono/shared/models/members/enums/PaymentStatus';
import { ReorderCardReason } from '../../api/types';

export type ProfileSchema = ProfileModel;
export type ApplicationSchema = ApplicationModel & {
  documents?: string[];
  reorderCardReason?: ReorderCardReason;
};

export type CardSchema = CardModel;

export type ApplicationReasonSchema = ApplicationReason;
export const allowedApplicationReasonValues: Array<ApplicationReasonSchema> = [
  ApplicationReason.SIGNUP,
  ApplicationReason.RENEWAL,
  ApplicationReason.LOST_CARD,
  ApplicationReason.REPRINT,
  ApplicationReason.NAME_CHANGE,
];
export const allowedEligibilityStatusValues = [
  EligibilityStatus.ELIGIBLE,
  EligibilityStatus.AWAITING_ID_APPROVAL,
  EligibilityStatus.ASSIGNED_FOR_APPROVAL,
  EligibilityStatus.INELIGIBLE,
  undefined,
] as const;
export type EligibilityStatusSchema = (typeof allowedEligibilityStatusValues)[number];

export const allowedPaymentStatusValues = [
  PaymentStatus.AWAITING_PAYMENT,
  PaymentStatus.PAID_CARD,
  PaymentStatus.PAID_PAYPAL,
  PaymentStatus.PAID_PROMO_CODE,
  PaymentStatus.PAID_CHEQUE,
  PaymentStatus.PAID_ADMIN,
  PaymentStatus.PENDING_REFUND,
  PaymentStatus.REFUNDED,
  undefined,
] as const;
export type PaymentStatusSchema = (typeof allowedPaymentStatusValues)[number];

export const allowedVerificationStatusValues = [
  EligibilityStatus.ELIGIBLE,
  'other',
  undefined,
] as const;
export type VerificationStatusSchema = (typeof allowedVerificationStatusValues)[number];

export type RejectionReasonSchema = RejectionReason;
export const allowedRejectionReasonValues: Array<RejectionReasonSchema | undefined> = [
  RejectionReason.BLURRY_IMAGE_DECLINE_ID,
  RejectionReason.DATE_DECLINE_ID,
  RejectionReason.DECLINE_INCORRECT_ID,
  RejectionReason.DIFFERENT_NAME_DECLINE_ID,
  RejectionReason.DECLINE_NOT_ELIGIBLE,
  RejectionReason.DL_PP_DECLINE_ID,
  RejectionReason.PASSWORD_PROTECTED_DECLINE_ID,
  RejectionReason.PICTURE_DECLINE_ID,
  undefined,
];
