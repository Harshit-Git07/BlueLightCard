import { ApplicationReason } from '../enums/ApplicationReason';

export interface MemberApplicationQueryPayload {
  brand: string;
  memberUUID: string;
  applicationId: string | null;
}

export interface MemberApplicationUpdatePayload {
  startDate: string;
  eligibilityStatus: string;
  applicationReason: ApplicationReason;
  verificationMethod: string;
  address1: string;
  address2: string;
  city: string;
  postcode: string;
  country: string;
  promoCode: string | null;
  idS3LocationPrimary: string;
  idS3LocationSecondary: string;
  trustedDomainEmail: string;
  trustedDomainValidated: boolean;
  nameChangeReason: string | null;
  nameChangeFirstName: string | null;
  nameChangeLastName: string | null;
  nameChangeDocType: string | null;
  rejectionReason: string | null;
}
