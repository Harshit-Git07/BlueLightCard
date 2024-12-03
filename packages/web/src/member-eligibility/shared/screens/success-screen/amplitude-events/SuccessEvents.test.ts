import { successEvents } from './SuccessEvents';
import { EligibilityDetails } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/types/eligibliity-details/EligibilityDetails';

describe('successEvents', () => {
  it('returns signup_click event for Sign Up flow on start browsing click', () => {
    const eligibilityDetails: EligibilityDetails = {
      flow: 'Sign Up',
      currentScreen: 'Success Screen',
      canSkipIdVerification: false,
    };
    expect(successEvents.onStartBrowsingClicked(eligibilityDetails)).toEqual({
      event: 'signup_click',
      params: {
        page_name: 'Success',
        CTA: 'start_browsing',
      },
    });
  });

  it('returns renewal_click event for Renewal flow on start browsing click', () => {
    const eligibilityDetails: EligibilityDetails = {
      flow: 'Renewal',
      currentScreen: 'Success Screen',
      canSkipIdVerification: false,
    };
    expect(successEvents.onStartBrowsingClicked(eligibilityDetails)).toEqual({
      event: 'renewal_click',
      params: {
        page_name: 'Success',
        CTA: 'start_browsing',
      },
    });
  });

  it('returns signup_click event for Sign Up flow on Google Pay click', () => {
    const eligibilityDetails: EligibilityDetails = {
      flow: 'Sign Up',
      currentScreen: 'Success Screen',
      canSkipIdVerification: false,
    };
    expect(successEvents.onGooglePayClicked(eligibilityDetails)).toEqual({
      event: 'signup_click',
      params: {
        page_name: 'Success',
        CTA: 'download_play_store',
      },
    });
  });

  it('returns renewal_click event for Renewal flow on Google Pay click', () => {
    const eligibilityDetails: EligibilityDetails = {
      flow: 'Renewal',
      currentScreen: 'Success Screen',
      canSkipIdVerification: false,
    };
    expect(successEvents.onGooglePayClicked(eligibilityDetails)).toEqual({
      event: 'renewal_click',
      params: {
        page_name: 'Success',
        CTA: 'download_play_store',
      },
    });
  });

  it('returns signup_click event for Sign Up flow on Apple Store click', () => {
    const eligibilityDetails: EligibilityDetails = {
      flow: 'Sign Up',
      currentScreen: 'Success Screen',
      canSkipIdVerification: false,
    };
    expect(successEvents.onAppleStoreClicked(eligibilityDetails)).toEqual({
      event: 'signup_click',
      params: {
        page_name: 'Success',
        CTA: 'download_app_store',
      },
    });
  });

  it('returns renewal_click event for Renewal flow on Apple Store click', () => {
    const eligibilityDetails: EligibilityDetails = {
      flow: 'Renewal',
      currentScreen: 'Success Screen',
      canSkipIdVerification: false,
    };
    expect(successEvents.onAppleStoreClicked(eligibilityDetails)).toEqual({
      event: 'renewal_click',
      params: {
        page_name: 'Success',
        CTA: 'download_app_store',
      },
    });
  });
});
