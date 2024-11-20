export interface EligibilityDetails {
  flow: 'Sign Up' | 'Renewal';
  currentScreen: EligibilityScreen;
  skipAccountDetails?: boolean;
  accountDetailsChanged?: boolean;
  employmentStatus?: EmploymentStatus;
  organisation?: EligibilityOrganisation;
  employer?: EligibilityEmployer;
  jobTitle?: string;
  promoCode?: string;
  requireMultipleIds?: boolean;
  canSkipIdVerification?: boolean;
  canSkipPayment?: boolean;
  emailVerification?: string;
  fileVerificationType?: string | [string, string];
  fileVerification?: Blob[];
  address?: EligibilityDetailsAddress;
}

export type EligibilityScreen =
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

export type EmploymentStatus = 'Employed' | 'Retired' | 'Volunteer';

export type EligibilityDetailsAddress = UkAddress | AusAddress;

export interface UkAddress {
  line1: string;
  line2?: string;
  city: string;
  postcode: string;
}

export interface AusAddress {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postcode: string;
}

export interface EligibilityOrganisation {
  id: string;
  label: string;
}

export interface EligibilityEmployer {
  id: string;
  label: string;
}

export type EligibilityDetailsWithoutFlow = Omit<EligibilityDetails, 'flow'>;
