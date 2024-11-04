export interface EligibilityDetails {
  currentScreen: EligibilityScreen;
  employmentStatus?: string;
  organisation?: string;
  employer?: string;
  jobTitle?: string;
  promoCode?: string;
  requireMultipleIds?: boolean;
  canSkipIdVerification?: boolean;
  canSkipPayment?: boolean;
  emailVerification?: string;
  fileVerification?: Blob;
  address?: EligibilityDetailsAddress;
}

export type EligibilityScreen =
  | 'Interstitial Screen'
  | 'Job Details Screen'
  | 'Employment Status Screen'
  | 'Verification Method Screen'
  | 'Work Email Verification Screen'
  | 'Work Email Retry Screen'
  | 'File Upload Verification Screen'
  | 'Delivery Address Screen'
  | 'Payment Screen'
  | 'Success Screen';

export interface EligibilityDetailsAddress {
  line1: string;
  line2: string;
  city: string;
  postcode: string;
}
