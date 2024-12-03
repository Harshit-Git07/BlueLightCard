import { AmplitudeEvents } from '@/root/src/member-eligibility/shared/amplitude-events/AmplitudeEvents';

export const interstitialEvents: AmplitudeEvents = {
  onFlowStarted: (eligibilityDetails) => ({
    event: eligibilityDetails.flow === 'Sign Up' ? 'signup_click' : 'renewal_click',
    params: {
      page_name: 'Interstitial',
      CTA: eligibilityDetails.flow === 'Sign Up' ? 'verify_eligibility' : 'account_details',
    },
  }),
  onSkipToJobDetails: (eligibilityDetails) => ({
    event: eligibilityDetails.flow === 'Sign Up' ? 'signup_click' : 'renewal_click',
    params: {
      page_name: 'Interstitial',
      CTA: 'employment_details',
    },
  }),
  onSkipToPayment: (eligibilityDetails) => ({
    event: eligibilityDetails.flow === 'Sign Up' ? 'signup_click' : 'renewal_click',
    params: {
      page_name: 'Interstitial',
      CTA: 'make_payment',
    },
  }),
};
