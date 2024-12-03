import { interstitialEvents } from './InterstitialEvents';
import { EligibilityDetails } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/types/eligibliity-details/EligibilityDetails';

describe('interstitialEvents', () => {
  it('returns signup_click event for Sign Up flow on flow started', () => {
    const eligibilityDetails: EligibilityDetails = {
      flow: 'Sign Up',
      currentScreen: 'Interstitial Screen',
      canSkipIdVerification: false,
    };
    expect(interstitialEvents.onFlowStarted(eligibilityDetails)).toEqual({
      event: 'signup_click',
      params: {
        page_name: 'Interstitial',
        CTA: 'verify_eligibility',
      },
    });
  });

  it('returns renewal_click event for Renewal flow on flow started', () => {
    const eligibilityDetails: EligibilityDetails = {
      flow: 'Renewal',
      currentScreen: 'Interstitial Screen',
      canSkipIdVerification: false,
    };
    expect(interstitialEvents.onFlowStarted(eligibilityDetails)).toEqual({
      event: 'renewal_click',
      params: {
        page_name: 'Interstitial',
        CTA: 'account_details',
      },
    });
  });

  it('returns signup_click event for Sign Up flow on skip to job details', () => {
    const eligibilityDetails: EligibilityDetails = {
      flow: 'Sign Up',
      currentScreen: 'Interstitial Screen',
      canSkipIdVerification: false,
    };
    expect(interstitialEvents.onSkipToJobDetails(eligibilityDetails)).toEqual({
      event: 'signup_click',
      params: {
        page_name: 'Interstitial',
        CTA: 'employment_details',
      },
    });
  });

  it('returns renewal_click event for Renewal flow on skip to job details', () => {
    const eligibilityDetails: EligibilityDetails = {
      flow: 'Renewal',
      currentScreen: 'Interstitial Screen',
      canSkipIdVerification: false,
    };
    expect(interstitialEvents.onSkipToJobDetails(eligibilityDetails)).toEqual({
      event: 'renewal_click',
      params: {
        page_name: 'Interstitial',
        CTA: 'employment_details',
      },
    });
  });

  it('returns signup_click event for Sign Up flow on skip to payment', () => {
    const eligibilityDetails: EligibilityDetails = {
      flow: 'Sign Up',
      currentScreen: 'Interstitial Screen',
      canSkipIdVerification: false,
    };
    expect(interstitialEvents.onSkipToPayment(eligibilityDetails)).toEqual({
      event: 'signup_click',
      params: {
        page_name: 'Interstitial',
        CTA: 'make_payment',
      },
    });
  });

  it('returns renewal_click event for Renewal flow on skip to payment', () => {
    const eligibilityDetails: EligibilityDetails = {
      flow: 'Renewal',
      currentScreen: 'Interstitial Screen',
      canSkipIdVerification: false,
    };
    expect(interstitialEvents.onSkipToPayment(eligibilityDetails)).toEqual({
      event: 'renewal_click',
      params: {
        page_name: 'Interstitial',
        CTA: 'make_payment',
      },
    });
  });
});
