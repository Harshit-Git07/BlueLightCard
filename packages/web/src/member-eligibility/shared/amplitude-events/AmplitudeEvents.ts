import { EligibilityDetails } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/types/eligibliity-details/EligibilityDetails';

export type AmplitudeEvents = Record<string, AmplitudeEventFunction>;

type AmplitudeEventFunction = (
  eligibilityDetails: EligibilityDetails,
  ...props: string[]
) => AmplitudeEvent;

export interface AmplitudeEvent {
  event: AmplitudeEventKey;
  params: AmplitudeParams;
}

type AmplitudeEventKey =
  | 'signup_click'
  | 'renewal_click'
  | 'make_payment'
  | 'signup_select'
  | 'renewal_select'
  | 'screen_view';

interface AmplitudeParams {
  page_name: PageName;
  [key: string]: string | undefined;
}

type PageName =
  | 'WorkEmailRetry'
  | 'JobDetails'
  | 'Success'
  | 'Interstitial'
  | 'FileUploadVerification'
  | 'Payment'
  | 'EmploymentStatus'
  | 'DeliveryAddress'
  | 'AccountDetails'
  | 'VerificationMethod'
  | 'WorkEmailVerification';
