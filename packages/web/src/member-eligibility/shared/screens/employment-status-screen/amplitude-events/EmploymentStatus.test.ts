import { employmentStatusEvents } from './EmploymentStatusEvents';
import { EligibilityDetails } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/types/eligibliity-details/EligibilityDetails';

describe('employmentStatusEvents', () => {
  it('returns signup_click event for Sign Up flow on back click', () => {
    const eligibilityDetails: EligibilityDetails = {
      currentScreen: 'Employment Status Screen',
      flow: 'Sign Up',
      canSkipIdVerification: false,
    };
    expect(employmentStatusEvents.onBackClicked(eligibilityDetails)).toEqual({
      event: 'signup_click',
      params: {
        page_name: 'EmploymentStatus',
        CTA: 'back',
      },
    });
  });

  it('returns renewal_click event for Renewal flow on back click', () => {
    const eligibilityDetails: EligibilityDetails = {
      flow: 'Renewal',
      currentScreen: 'Employment Status Screen',
      canSkipIdVerification: false,
    };
    expect(employmentStatusEvents.onBackClicked(eligibilityDetails)).toEqual({
      event: 'renewal_click',
      params: {
        page_name: 'EmploymentStatus',
        CTA: 'back',
      },
    });
  });

  it('returns signup_click event for Sign Up flow on forward click with employment status', () => {
    const eligibilityDetails: EligibilityDetails = {
      flow: 'Sign Up',
      currentScreen: 'Employment Status Screen',
      canSkipIdVerification: false,
      employmentStatus: 'Employed',
    };
    expect(employmentStatusEvents.onForwardClicked(eligibilityDetails)).toEqual({
      event: 'signup_select',
      params: {
        page_name: 'EmploymentStatus',
        select_name: 'EmploymentStatus',
        select_type: 'card_selector',
        Selection: 'Employed',
      },
    });
  });

  it('returns renewal_click event for Renewal flow on forward click with employment status', () => {
    const eligibilityDetails: EligibilityDetails = {
      flow: 'Renewal',
      currentScreen: 'Employment Status Screen',
      canSkipIdVerification: false,
      employmentStatus: 'Volunteer',
    };
    expect(employmentStatusEvents.onForwardClicked(eligibilityDetails)).toEqual({
      event: 'renewal_select',
      params: {
        page_name: 'EmploymentStatus',
        select_name: 'EmploymentStatus',
        select_type: 'card_selector',
        Selection: 'Volunteer',
      },
    });
  });
});
