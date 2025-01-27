import { DropdownOption } from '@bluelightcard/shared-ui/components/Dropdown/types';

export interface EligibilityDetails {
  flow: 'Sign Up' | 'Renewal';
  currentScreen: EligibilityScreenName;
  hasJumpedStraightToPayment?: boolean;
  hasSkippedAccountDetails?: boolean;
  accountDetailsChanged?: boolean;
  member?: EligibilityDetailsMember;
  address?: EligibilityDetailsAddress;
  employmentStatus?: EmploymentStatus;
  organisation?: EligibilityOrganisation;
  employer?: EligibilityEmployer;
  jobTitle?: string;
  jobReference?: string;
  jobDetailsAus?: EligibilityJobDetailsAus;
  promoCode?: string;
  requireMultipleIds?: boolean;
  canSkipIdVerification?: boolean;
  canSkipPayment?: boolean;
  emailVerification?: string;
  fileVerificationType?: string | [string, string];
  fileVerification?: UploadedDocuments;
  currentIdRequirementDetails?: IdRequirementDetails[];
}

export type UploadedDocuments = {
  documentId: string;
  fileName?: string;
}[];

export type EligibilityScreenName =
  | 'Interstitial Screen'
  | 'Renewal Account Details Screen'
  | 'Job Details Screen'
  | 'Employment Status Screen'
  | 'Verification Method Screen'
  | 'Work Email Verification Screen'
  | 'Work Email Retry Screen'
  | 'File Upload Verification Screen'
  | 'Delivery Address Screen'
  | 'Payment Screen'
  | 'Success Screen';

export type EmploymentStatus = 'Employed' | 'Retired or Bereaved' | 'Volunteer';

export type EligibilityDetailsAddress = UkAddress | AusAddress;

export interface UkAddress {
  line1: string;
  line2?: string;
  city: string;
  county: string;
  postcode: string;
}

export interface AusAddress {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postcode: string;
}

export interface EligibilityOrganisation extends DropdownOption {
  requiresJobTitle: boolean;
  requiresJobReference: boolean;
  promoCodeEffect?: PromoCodeEffect;
  idRequirements?: IdRequirementDetails[];
}

export interface EligibilityEmployer extends DropdownOption {
  requiresJobTitle: boolean;
  requiresJobReference: boolean;
  promoCodeEffect?: PromoCodeEffect;
  idRequirements?: IdRequirementDetails[];
}

export interface IdRequirementDetails {
  title: string;
  description: string;
  guidelines: string;
  type: 'file upload' | 'email';
  required: boolean;
}

export interface EligibilityJobDetailsAus {
  isSelfEmployed?: boolean;
  employerAus?: string;
  australianBusinessNumber?: string;
}

export interface EligibilityDetailsMember {
  id?: string;
  firstName: string;
  surname: string;
  dob?: Date;
  application?: EligibilityDetailsApplication;
}

export interface EligibilityDetailsApplication {
  id: string;
}

export type EligibilityDetailsWithoutFlow = Omit<EligibilityDetails, 'flow'>;
export type PromoCodeEffect = 'Bypass ID' | 'Bypass Payment';
