import { EligibilityDetails } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/types/eligibliity-details/EligibilityDetails';
import { AmplitudeEvents } from '@/root/src/member-eligibility/shared/amplitude-events/AmplitudeEvents';

export const workEmailRetryEvents: AmplitudeEvents = {
  onEditClicked: (eligibilityDetails: EligibilityDetails) => ({
    event: eligibilityDetails.flow === 'Sign Up' ? 'signup_click' : 'renewal_click',
    params: {
      page_name: 'WorkEmailRetry',
      CTA: 'edit_email',
    },
  }),
  onResendClicked: (eligibilityDetails: EligibilityDetails) => ({
    event: eligibilityDetails.flow === 'Sign Up' ? 'signup_click' : 'renewal_click',
    params: {
      page_name: 'WorkEmailRetry',
      CTA: 'resend_email',
    },
  }),
};
