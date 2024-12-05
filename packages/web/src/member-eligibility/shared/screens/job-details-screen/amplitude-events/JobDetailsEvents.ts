import { EligibilityDetails } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/types/eligibliity-details/EligibilityDetails';
import { AmplitudeEvents } from '@/root/src/member-eligibility/shared/amplitude-events/AmplitudeEvents';

export const jobDetailsEvents: AmplitudeEvents = {
  onOrganisationSelected: (eligibilityDetails: EligibilityDetails) => ({
    event: eligibilityDetails.flow === 'Sign Up' ? 'signup_select' : 'renewal_select',
    params: {
      page_name: 'JobDetails',
      select_name: 'Organisation',
      select_type: 'dropdown',
      Selection: eligibilityDetails.organisation?.label,
    },
  }),
  onEmployerSelected: (eligibilityDetails: EligibilityDetails) => ({
    event: eligibilityDetails.flow === 'Sign Up' ? 'signup_select' : 'renewal_select',
    params: {
      page_name: 'JobDetails',
      select_name: 'Employer',
      select_type: 'dropdown',
      Selection: eligibilityDetails.employer?.label,
    },
  }),
  onJobTitleSelected: (eligibilityDetails: EligibilityDetails) => ({
    event: eligibilityDetails.flow === 'Sign Up' ? 'signup_select' : 'renewal_select',
    params: {
      page_name: 'JobDetails',
      select_name: 'Job Title',
      select_type: 'textbox',
      Selection: eligibilityDetails.jobTitle,
    },
  }),
  onPromoCodeSelected: (eligibilityDetails: EligibilityDetails) => ({
    event: eligibilityDetails.flow === 'Sign Up' ? 'signup_select' : 'renewal_select',
    params: {
      page_name: 'JobDetails',
      select_name: 'Job Title',
      select_type: 'textbox',
      Selection: eligibilityDetails.promoCode,
    },
  }),
  onBackClicked: (eligibilityDetails: EligibilityDetails) => ({
    event: eligibilityDetails.flow === 'Sign Up' ? 'signup_click' : 'renewal_click',
    params: {
      page_name: 'JobDetails',
      CTA: 'back',
    },
  }),
};
