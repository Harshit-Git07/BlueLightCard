import { EligibilityDetails } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/types/eligibliity-details/EligibilityDetails';
import { AmplitudeEvents } from '@/root/src/member-eligibility/shared/amplitude-events/AmplitudeEvents';

export const employmentStatusEvents: AmplitudeEvents = {
  onBackClicked: (eligibilityDetails: EligibilityDetails) => ({
    event: eligibilityDetails.flow === 'Sign Up' ? 'signup_click' : 'renewal_click',
    params: {
      page_name: 'EmploymentStatus',
      CTA: 'back',
    },
  }),
  onForwardClicked: (eligibilityDetails: EligibilityDetails) => ({
    event: eligibilityDetails.flow === 'Sign Up' ? 'signup_click' : 'renewal_click',
    params: {
      page_name: 'EmploymentStatus',
      select_name: 'EmploymentStatus',
      select_type: 'card_selector',
      Selection: eligibilityDetails.employmentStatus,
    },
  }),
};
