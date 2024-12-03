export interface ServiceLayerMemberProfile {
  memberId: string; // uuid
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string; // date
  organisationId?: string; // uuid
  lastLogin?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY';
  jobTitle?: string;
  county?: string;
  employerName?: string;
  spareEmail?: string;
  signupDate?: string; // date-time
  employmentType?: string;
  lastIpAddress?: string;
  jobReference?: string;
  employerId?: string; // uuid
  phoneNumber?: string;
  idUploaded?: string;
  spareEmailValidated?: boolean; // default: false
  emailValidated?: boolean; // default: false
  gaKey?: string;
  status?: string;
  card?: Card;
  applications?: Application[];
}

interface Card {
  memberId: string; // uuid
  cardNumber: string;
  nameOnCard?: string;
  purchaseTime?: string; // date-time
  cardStatus?:
    | 'AWAITING_BATCHING'
    | 'ADDED_TO_BATCH'
    | 'AWAITING_POSTAGE'
    | 'PHYSICAL_CARD'
    | 'VIRTUAL_CARD'
    | 'CARD_LOST'
    | 'DISABLED'
    | 'CARD_EXPIRED';
  paymentStatus?:
    | 'AWAITING_PAYMENT'
    | 'PAID_CARD'
    | 'PAID_PAYPAL'
    | 'PAID_PROMO_CODE'
    | 'PAID_CHEQUE'
    | 'PAID_ADMIN'
    | 'PENDING_REFUND'
    | 'REFUNDED';
  postedDate?: string; // date-time
  batchNumber?: string;
}

interface Application {
  memberId: string; // uuid
  applicationId: string; // uuid
  applicationReason: 'SIGNUP' | 'RENEWAL' | 'NAME_CHANGE' | 'LOST_CARD' | 'REPRINT';
  country?: string;
  address2?: string;
  city?: string;
  address1?: string;
  postcode?: string;
  eligibilityStatus?: string;
  trustedDomainValidated?: boolean;
  idS3LocationSecondary?: string;
  promoCode?: Record<string, any>; // Don't know what this type is
  verificationMethod?: string;
  rejectionReason?:
    | 'DECLINE_INCORRECT_ID'
    | 'PICTURE_DECLINE_ID'
    | 'DL_PP_DECLINE_ID'
    | 'DATE_DECLINE_ID'
    | 'BLURRY_IMAGE_DECLINE_ID'
    | 'DIFFERENT_NAME_DECLINE_ID'
    | 'PASSWORD_PROTECTED_DECLINE_ID'
    | 'DECLINE_NOT_ELIGIBLE';
  startDate?: string; // date
  trustedDomainEmail?: string;
  idS3LocationPrimary?: string;
}
