import { EligibilityDetails } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/types/eligibliity-details/EligibilityDetails';
import { AmplitudeEvents } from '@/root/src/member-eligibility/shared/amplitude-events/AmplitudeEvents';

export const verificationMethodEvents: AmplitudeEvents = {
  onClickedBack: (eligibilityDetails: EligibilityDetails) => ({
    event: eligibilityDetails.flow === 'Sign Up' ? 'signup_click' : 'renewal_click',
    params: {
      page_name: 'VerificationMethod',
      CTA: 'back',
    },
  }),
  onMethodSelected: (eligibilityDetails: EligibilityDetails, verificationMethod) => ({
    event: eligibilityDetails.flow === 'Sign Up' ? 'signup_select' : 'renewal_select',
    params: {
      page_name: 'VerificationMethod',
      select_name: 'verification_method',
      select_type: 'card_selector',
      Selection: verificationMethod,
    },
  }),
};
