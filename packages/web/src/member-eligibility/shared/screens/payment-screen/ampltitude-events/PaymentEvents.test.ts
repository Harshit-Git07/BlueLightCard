import { paymentEvents } from './PaymentEvents';
import { EligibilityDetails } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/types/eligibliity-details/EligibilityDetails';

describe('paymentEvents', () => {
  it('returns signup_click event for Sign Up flow on back click', () => {
    const eligibilityDetails: EligibilityDetails = {
      flow: 'Sign Up',
      currentScreen: 'Payment Screen',
      canSkipIdVerification: false,
    };
    expect(paymentEvents.onBackCLicked(eligibilityDetails)).toEqual({
      event: 'signup_click',
      params: {
        page_name: 'Payment',
        CTA: 'back',
      },
    });
  });

  it('returns renewal_click event for Renewal flow on back click', () => {
    const eligibilityDetails: EligibilityDetails = {
      flow: 'Renewal',
      currentScreen: 'Payment Screen',
      canSkipIdVerification: false,
    };
    expect(paymentEvents.onBackCLicked(eligibilityDetails)).toEqual({
      event: 'renewal_click',
      params: {
        page_name: 'Payment',
        CTA: 'back',
      },
    });
  });

  it('returns signup_click event for Sign Up flow on pay click', () => {
    const eligibilityDetails: EligibilityDetails = {
      flow: 'Sign Up',
      currentScreen: 'Payment Screen',
      canSkipIdVerification: false,
    };
    expect(paymentEvents.onPayClicked(eligibilityDetails)).toEqual({
      event: 'signup_click',
      params: {
        page_name: 'Payment',
        CTA: 'pay_and_finish',
      },
    });
  });

  it('returns renewal_click event for Renewal flow on pay click', () => {
    const eligibilityDetails: EligibilityDetails = {
      flow: 'Renewal',
      currentScreen: 'Payment Screen',
      canSkipIdVerification: false,
    };
    expect(paymentEvents.onPayClicked(eligibilityDetails)).toEqual({
      event: 'renewal_click',
      params: {
        page_name: 'Payment',
        CTA: 'pay_and_finish',
      },
    });
  });
});
