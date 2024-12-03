import { EligibilityDetails } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/types/eligibliity-details/EligibilityDetails';
import { AmplitudeEvents } from '@/root/src/member-eligibility/shared/amplitude-events/AmplitudeEvents';

export const fileUploadVerificationEvents: AmplitudeEvents = {
  onEditClicked: (eligibilityDetails: EligibilityDetails) => ({
    event: eligibilityDetails.flow === 'Sign Up' ? 'signup_click' : 'renewal_click',
    params: {
      page_name: 'FileUploadVerification',
      CTA: 'clear_id_type',
    },
  }),
  onSubmitClicked: (eligibilityDetails: EligibilityDetails) => ({
    event: eligibilityDetails.flow === 'Sign Up' ? 'signup_click' : 'renewal_click',
    params: {
      page_name: 'FileUploadVerification',
      CTA: 'submit_id',
    },
  }),
  onChooseFileClicked: (eligibilityDetails: EligibilityDetails) => ({
    event: eligibilityDetails.flow === 'Sign Up' ? 'signup_click' : 'renewal_click',
    params: {
      page_name: 'FileUploadVerification',
      CTA: 'choose_file',
    },
  }),
  onRemoveFileClicked: (eligibilityDetails: EligibilityDetails) => ({
    event: eligibilityDetails.flow === 'Sign Up' ? 'signup_click' : 'renewal_click',
    params: {
      page_name: 'FileUploadVerification',
      CTA: 'remove_file',
    },
  }),
};
