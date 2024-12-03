import { workEmailRetryEvents } from './WorkEmailRetryEvents';
import { EligibilityDetails } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/types/eligibliity-details/EligibilityDetails';

describe('workEmailRetryEvents', () => {
  it('returns signup_click event for Sign Up flow on edit click', () => {
    const eligibilityDetails: EligibilityDetails = {
      flow: 'Sign Up',
      currentScreen: 'Work Email Retry Screen',
      canSkipIdVerification: false,
    };
    expect(workEmailRetryEvents.onEditClicked(eligibilityDetails)).toEqual({
      event: 'signup_click',
      params: {
        page_name: 'WorkEmailRetry',
        CTA: 'edit_email',
      },
    });
  });

  it('returns renewal_click event for Renewal flow on edit click', () => {
    const eligibilityDetails: EligibilityDetails = {
      flow: 'Renewal',
      currentScreen: 'Work Email Retry Screen',
      canSkipIdVerification: false,
    };
    expect(workEmailRetryEvents.onEditClicked(eligibilityDetails)).toEqual({
      event: 'renewal_click',
      params: {
        page_name: 'WorkEmailRetry',
        CTA: 'edit_email',
      },
    });
  });

  it('returns signup_click event for Sign Up flow on resend click', () => {
    const eligibilityDetails: EligibilityDetails = {
      flow: 'Sign Up',
      currentScreen: 'Work Email Retry Screen',
      canSkipIdVerification: false,
    };
    expect(workEmailRetryEvents.onResendClicked(eligibilityDetails)).toEqual({
      event: 'signup_click',
      params: {
        page_name: 'WorkEmailRetry',
        CTA: 'resend_email',
      },
    });
  });

  it('returns renewal_click event for Renewal flow on resend click', () => {
    const eligibilityDetails: EligibilityDetails = {
      flow: 'Renewal',
      currentScreen: 'Work Email Retry Screen',
      canSkipIdVerification: false,
    };
    expect(workEmailRetryEvents.onResendClicked(eligibilityDetails)).toEqual({
      event: 'renewal_click',
      params: {
        page_name: 'WorkEmailRetry',
        CTA: 'resend_email',
      },
    });
  });
});
