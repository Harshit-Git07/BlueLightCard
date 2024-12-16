import type { components } from '../../generated/MembersApi';

export type ProfileSchema = components['schemas']['ProfileModel'];
export type ApplicationSchema = ProfileSchema['applications'][number] & {
  documents?: string[];
  county?: string;
};

export type ApplicationReasonSchema = ApplicationSchema['applicationReason'];
export const allowedApplicationReasonValues: Array<ApplicationReasonSchema> = [
  'SIGNUP',
  'RENEWAL',
  'LOST_CARD',
  'REPRINT',
  'NAME_CHANGE',
];
export const allowedEligibilityStatusValues = [
  'ELIGIBLE',
  'AWAITING_ID_APPROVAL',
  'ASSIGNED_FOR_APPROVAL',
  'INELIGIBLE',
  undefined,
] as const;
export type EligibilityStatusSchema = (typeof allowedEligibilityStatusValues)[number];

export const allowedPaymentStatusValues = [
  'AWAITING_PAYMENT',
  'PAID_CARD',
  'PAID_PAYPAL',
  'PAID_PROMO_CODE',
  'PAID_CHEQUE',
  'PAID_ADMIN',
  'PENDING_REFUND',
  'REFUNDED',
  undefined,
] as const;
export type PaymentStatusSchema = (typeof allowedPaymentStatusValues)[number];

export const allowedVerificationStatusValues = ['ELIGIBLE', 'other', undefined] as const;
export type VerificationStatusSchema = (typeof allowedVerificationStatusValues)[number];

export type RejectionReasonSchema = ApplicationSchema['rejectionReason'];
export const allowedRejectionReasonValues: Array<RejectionReasonSchema> = [
  'BLURRY_IMAGE_DECLINE_ID',
  'DATE_DECLINE_ID',
  'DECLINE_INCORRECT_ID',
  'DIFFERENT_NAME_DECLINE_ID',
  'DECLINE_NOT_ELIGIBLE',
  'DL_PP_DECLINE_ID',
  'PASSWORD_PROTECTED_DECLINE_ID',
  'PICTURE_DECLINE_ID',
  undefined,
];
