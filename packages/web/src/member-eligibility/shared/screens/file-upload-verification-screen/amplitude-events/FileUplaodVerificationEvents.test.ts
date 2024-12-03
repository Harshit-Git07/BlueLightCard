import { fileUploadVerificationEvents } from './FileUploadVerificationEvents';
import { EligibilityDetails } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/types/eligibliity-details/EligibilityDetails';

describe('fileUploadVerificationEvents', () => {
  it('returns signup_click event for Sign Up flow on edit click', () => {
    const eligibilityDetails: EligibilityDetails = {
      flow: 'Sign Up',
      currentScreen: 'File Upload Verification Screen',
      canSkipIdVerification: false,
    };
    expect(fileUploadVerificationEvents.onEditClicked(eligibilityDetails)).toEqual({
      event: 'signup_click',
      params: {
        page_name: 'FileUploadVerification',
        CTA: 'clear_id_type',
      },
    });
  });

  it('returns renewal_click event for Renewal flow on edit click', () => {
    const eligibilityDetails: EligibilityDetails = {
      flow: 'Renewal',
      currentScreen: 'File Upload Verification Screen',
      canSkipIdVerification: false,
    };
    expect(fileUploadVerificationEvents.onEditClicked(eligibilityDetails)).toEqual({
      event: 'renewal_click',
      params: {
        page_name: 'FileUploadVerification',
        CTA: 'clear_id_type',
      },
    });
  });

  it('returns signup_click event for Sign Up flow on submit click', () => {
    const eligibilityDetails: EligibilityDetails = {
      flow: 'Sign Up',
      currentScreen: 'File Upload Verification Screen',
      canSkipIdVerification: false,
    };
    expect(fileUploadVerificationEvents.onSubmitClicked(eligibilityDetails)).toEqual({
      event: 'signup_click',
      params: {
        page_name: 'FileUploadVerification',
        CTA: 'submit_id',
      },
    });
  });

  it('returns renewal_click event for Renewal flow on submit click', () => {
    const eligibilityDetails: EligibilityDetails = {
      flow: 'Renewal',
      currentScreen: 'File Upload Verification Screen',
      canSkipIdVerification: false,
    };
    expect(fileUploadVerificationEvents.onSubmitClicked(eligibilityDetails)).toEqual({
      event: 'renewal_click',
      params: {
        page_name: 'FileUploadVerification',
        CTA: 'submit_id',
      },
    });
  });

  it('returns signup_click event for Sign Up flow on choose file click', () => {
    const eligibilityDetails: EligibilityDetails = {
      flow: 'Sign Up',
      currentScreen: 'File Upload Verification Screen',
      canSkipIdVerification: false,
    };
    expect(fileUploadVerificationEvents.onChooseFileClicked(eligibilityDetails)).toEqual({
      event: 'signup_click',
      params: {
        page_name: 'FileUploadVerification',
        CTA: 'choose_file',
      },
    });
  });

  it('returns renewal_click event for Renewal flow on choose file click', () => {
    const eligibilityDetails: EligibilityDetails = {
      flow: 'Renewal',
      currentScreen: 'File Upload Verification Screen',
      canSkipIdVerification: false,
    };
    expect(fileUploadVerificationEvents.onChooseFileClicked(eligibilityDetails)).toEqual({
      event: 'renewal_click',
      params: {
        page_name: 'FileUploadVerification',
        CTA: 'choose_file',
      },
    });
  });

  it('returns signup_click event for Sign Up flow on remove file click', () => {
    const eligibilityDetails: EligibilityDetails = {
      flow: 'Sign Up',
      currentScreen: 'File Upload Verification Screen',
      canSkipIdVerification: false,
    };
    expect(fileUploadVerificationEvents.onRemoveFileClicked(eligibilityDetails)).toEqual({
      event: 'signup_click',
      params: {
        page_name: 'FileUploadVerification',
        CTA: 'remove_file',
      },
    });
  });

  it('returns renewal_click event for Renewal flow on remove file click', () => {
    const eligibilityDetails: EligibilityDetails = {
      flow: 'Renewal',
      currentScreen: 'File Upload Verification Screen',
      canSkipIdVerification: false,
    };
    expect(fileUploadVerificationEvents.onRemoveFileClicked(eligibilityDetails)).toEqual({
      event: 'renewal_click',
      params: {
        page_name: 'FileUploadVerification',
        CTA: 'remove_file',
      },
    });
  });
});
