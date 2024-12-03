import { EligibilityDetails } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/types/eligibliity-details/EligibilityDetails';
import { AmplitudeEvents } from '@/root/src/member-eligibility/shared/amplitude-events/AmplitudeEvents';

export const paymentEvents: AmplitudeEvents = {
  onBackCLicked: (eligibilityDetails: EligibilityDetails) => ({
    event: eligibilityDetails.flow === 'Sign Up' ? 'signup_click' : 'renewal_click',
    params: {
      page_name: 'Payment',
      CTA: 'back',
    },
  }),
  onPayClicked: (eligibilityDetails: EligibilityDetails) => ({
    event: eligibilityDetails.flow === 'Sign Up' ? 'signup_click' : 'renewal_click',
    params: {
      page_name: 'Payment',
      CTA: 'pay_and_finish',
    },
  }),
};
