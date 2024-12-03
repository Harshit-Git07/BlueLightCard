import { verificationMethodEvents } from './VerificationMethodEvents';
import { EligibilityDetails } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/types/eligibliity-details/EligibilityDetails';

describe('verificationMethodEvents', () => {
  it('returns signup_click event for Sign Up flow on back click', () => {
    const eligibilityDetails: EligibilityDetails = {
      flow: 'Sign Up',
      currentScreen: 'Verification Method Screen',
      canSkipIdVerification: false,
    };
    expect(verificationMethodEvents.onClickedBack(eligibilityDetails)).toEqual({
      event: 'signup_click',
      params: {
        page_name: 'VerificationMethod',
        CTA: 'back',
      },
    });
  });

  it('returns renewal_click event for Renewal flow on back click', () => {
    const eligibilityDetails: EligibilityDetails = {
      flow: 'Renewal',
      currentScreen: 'Verification Method Screen',
      canSkipIdVerification: false,
    };
    expect(verificationMethodEvents.onClickedBack(eligibilityDetails)).toEqual({
      event: 'renewal_click',
      params: {
        page_name: 'VerificationMethod',
        CTA: 'back',
      },
    });
  });

  it('returns signup_select event for Sign Up flow on method selected', () => {
    const eligibilityDetails: EligibilityDetails = {
      flow: 'Sign Up',
      currentScreen: 'Verification Method Screen',
      canSkipIdVerification: false,
    };
    const verificationMethod = 'Email';
    expect(
      verificationMethodEvents.onMethodSelected(eligibilityDetails, verificationMethod)
    ).toEqual({
      event: 'signup_select',
      params: {
        page_name: 'VerificationMethod',
        select_name: 'verification_method',
        select_type: 'card_selector',
        Selection: 'Email',
      },
    });
  });

  it('returns renewal_select event for Renewal flow on method selected', () => {
    const eligibilityDetails: EligibilityDetails = {
      flow: 'Renewal',
      currentScreen: 'Verification Method Screen',
      canSkipIdVerification: false,
    };
    const verificationMethod = 'SMS';
    expect(
      verificationMethodEvents.onMethodSelected(eligibilityDetails, verificationMethod)
    ).toEqual({
      event: 'renewal_select',
      params: {
        page_name: 'VerificationMethod',
        select_name: 'verification_method',
        select_type: 'card_selector',
        Selection: 'SMS',
      },
    });
  });
});
