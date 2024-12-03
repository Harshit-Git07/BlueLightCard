import { EligibilityDetails } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/types/eligibliity-details/EligibilityDetails';
import { AmplitudeEvents } from '@/root/src/member-eligibility/shared/amplitude-events/AmplitudeEvents';

export const workEmailVerificationEvents: AmplitudeEvents = {
  onEmailAdded: (eligibilityDetails: EligibilityDetails) => ({
    event: eligibilityDetails.flow === 'Sign Up' ? 'signup_select' : 'renewal_select',
    params: {
      page_name: 'WorkEmailVerification',
      select_name: 'work_email',
      select_type: 'textbox',
    },
  }),
  onSendClicked: (eligibilityDetails: EligibilityDetails) => ({
    event: eligibilityDetails.flow === 'Sign Up' ? 'signup_click' : 'renewal_click',
    params: {
      page_name: 'WorkEmailVerification',
      CTA: 'send_verification_link',
    },
  }),
  onBackClicked: (eligibilityDetails: EligibilityDetails) => ({
    event: eligibilityDetails.flow === 'Sign Up' ? 'signup_click' : 'renewal_click',
    params: {
      page_name: 'WorkEmailVerification',
      CTA: 'clear',
    },
  }),
};
