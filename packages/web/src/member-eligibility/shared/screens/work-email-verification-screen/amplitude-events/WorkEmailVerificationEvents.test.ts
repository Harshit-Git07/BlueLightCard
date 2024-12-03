import { workEmailVerificationEvents } from './WorkEmailVerificationEvents';
import { EligibilityDetails } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/types/eligibliity-details/EligibilityDetails';

describe('workEmailVerificationEvents', () => {
  it('returns signup_select event for Sign Up flow on email added', () => {
    const eligibilityDetails: EligibilityDetails = {
      flow: 'Sign Up',
      currentScreen: 'Work Email Verification Screen',
      canSkipIdVerification: false,
    };
    expect(workEmailVerificationEvents.onEmailAdded(eligibilityDetails)).toEqual({
      event: 'signup_select',
      params: {
        page_name: 'WorkEmailVerification',
        select_name: 'work_email',
        select_type: 'textbox',
      },
    });
  });

  it('returns renewal_select event for Renewal flow on email added', () => {
    const eligibilityDetails: EligibilityDetails = {
      flow: 'Renewal',
      currentScreen: 'Work Email Verification Screen',
      canSkipIdVerification: false,
    };
    expect(workEmailVerificationEvents.onEmailAdded(eligibilityDetails)).toEqual({
      event: 'renewal_select',
      params: {
        page_name: 'WorkEmailVerification',
        select_name: 'work_email',
        select_type: 'textbox',
      },
    });
  });

  it('returns signup_click event for Sign Up flow on send click', () => {
    const eligibilityDetails: EligibilityDetails = {
      flow: 'Sign Up',
      currentScreen: 'Work Email Verification Screen',
      canSkipIdVerification: false,
    };
    expect(workEmailVerificationEvents.onSendClicked(eligibilityDetails)).toEqual({
      event: 'signup_click',
      params: {
        page_name: 'WorkEmailVerification',
        CTA: 'send_verification_link',
      },
    });
  });

  it('returns renewal_click event for Renewal flow on send click', () => {
    const eligibilityDetails: EligibilityDetails = {
      flow: 'Renewal',
      currentScreen: 'Work Email Verification Screen',
      canSkipIdVerification: false,
    };
    expect(workEmailVerificationEvents.onSendClicked(eligibilityDetails)).toEqual({
      event: 'renewal_click',
      params: {
        page_name: 'WorkEmailVerification',
        CTA: 'send_verification_link',
      },
    });
  });

  it('returns signup_click event for Sign Up flow on back click', () => {
    const eligibilityDetails: EligibilityDetails = {
      flow: 'Sign Up',
      currentScreen: 'Work Email Verification Screen',
      canSkipIdVerification: false,
    };
    expect(workEmailVerificationEvents.onBackClicked(eligibilityDetails)).toEqual({
      event: 'signup_click',
      params: {
        page_name: 'WorkEmailVerification',
        CTA: 'clear',
      },
    });
  });

  it('returns renewal_click event for Renewal flow on back click', () => {
    const eligibilityDetails: EligibilityDetails = {
      flow: 'Renewal',
      currentScreen: 'Work Email Verification Screen',
      canSkipIdVerification: false,
    };
    expect(workEmailVerificationEvents.onBackClicked(eligibilityDetails)).toEqual({
      event: 'renewal_click',
      params: {
        page_name: 'WorkEmailVerification',
        CTA: 'clear',
      },
    });
  });
});
