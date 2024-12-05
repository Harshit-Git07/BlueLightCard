import { jobDetailsEvents } from './JobDetailsEvents';
import { EligibilityDetails } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/types/eligibliity-details/EligibilityDetails';

describe('jobDetailsEvents', () => {
  it('returns signup_select event for Sign Up flow on organisation selected', () => {
    const eligibilityDetails: EligibilityDetails = {
      flow: 'Sign Up',
      currentScreen: 'Job Details Screen',
      organisation: { id: '123', label: 'Organisation A' },
    };
    expect(jobDetailsEvents.onOrganisationSelected(eligibilityDetails)).toEqual({
      event: 'signup_select',
      params: {
        page_name: 'JobDetails',
        select_name: 'Organisation',
        select_type: 'dropdown',
        Selection: 'Organisation A',
      },
    });
  });

  it('returns renewal_select event for Renewal flow on organisation selected', () => {
    const eligibilityDetails: EligibilityDetails = {
      flow: 'Renewal',
      currentScreen: 'Job Details Screen',
      organisation: { id: '123', label: 'Organisation B' },
    };
    expect(jobDetailsEvents.onOrganisationSelected(eligibilityDetails)).toEqual({
      event: 'renewal_select',
      params: {
        page_name: 'JobDetails',
        select_name: 'Organisation',
        select_type: 'dropdown',
        Selection: 'Organisation B',
      },
    });
  });

  it('returns signup_select event for Sign Up flow on employer selected', () => {
    const eligibilityDetails: EligibilityDetails = {
      flow: 'Sign Up',
      currentScreen: 'Job Details Screen',
      employer: { id: '123', label: 'Employer A' },
    };
    expect(jobDetailsEvents.onEmployerSelected(eligibilityDetails)).toEqual({
      event: 'signup_select',
      params: {
        page_name: 'JobDetails',
        select_name: 'Employer',
        select_type: 'dropdown',
        Selection: 'Employer A',
      },
    });
  });

  it('returns renewal_select event for Renewal flow on employer selected', () => {
    const eligibilityDetails: EligibilityDetails = {
      flow: 'Renewal',
      currentScreen: 'Job Details Screen',
      employer: { id: '123', label: 'Employer B' },
    };
    expect(jobDetailsEvents.onEmployerSelected(eligibilityDetails)).toEqual({
      event: 'renewal_select',
      params: {
        page_name: 'JobDetails',
        select_name: 'Employer',
        select_type: 'dropdown',
        Selection: 'Employer B',
      },
    });
  });

  it('returns signup_select event for Sign Up flow on job title selected', () => {
    const eligibilityDetails: EligibilityDetails = {
      flow: 'Sign Up',
      currentScreen: 'Job Details Screen',
      jobTitle: 'Nurse',
    };
    expect(jobDetailsEvents.onJobTitleSelected(eligibilityDetails)).toEqual({
      event: 'signup_select',
      params: {
        page_name: 'JobDetails',
        select_name: 'Job Title',
        select_type: 'textbox',
        Selection: 'Nurse',
      },
    });
  });

  it('returns renewal_select event for Renewal flow on job title selected', () => {
    const eligibilityDetails: EligibilityDetails = {
      flow: 'Renewal',
      currentScreen: 'Job Details Screen',
      jobTitle: 'Nurse',
    };
    expect(jobDetailsEvents.onJobTitleSelected(eligibilityDetails)).toEqual({
      event: 'renewal_select',
      params: {
        page_name: 'JobDetails',
        select_name: 'Job Title',
        select_type: 'textbox',
        Selection: 'Nurse',
      },
    });
  });

  it('returns signup_select event for Sign Up flow on promo code selected', () => {
    const eligibilityDetails: EligibilityDetails = {
      flow: 'Sign Up',
      currentScreen: 'Job Details Screen',
      promoCode: 'PROMO123',
    };
    expect(jobDetailsEvents.onPromoCodeSelected(eligibilityDetails)).toEqual({
      event: 'signup_select',
      params: {
        page_name: 'JobDetails',
        select_name: 'Job Title',
        select_type: 'textbox',
        Selection: 'PROMO123',
      },
    });
  });

  it('returns renewal_select event for Renewal flow on promo code selected', () => {
    const eligibilityDetails: EligibilityDetails = {
      flow: 'Renewal',
      currentScreen: 'Job Details Screen',
      promoCode: 'PROMO456',
    };
    expect(jobDetailsEvents.onPromoCodeSelected(eligibilityDetails)).toEqual({
      event: 'renewal_select',
      params: {
        page_name: 'JobDetails',
        select_name: 'Job Title',
        select_type: 'textbox',
        Selection: 'PROMO456',
      },
    });
  });

  it('returns signup_select event for Sign Up flow on back click', () => {
    const eligibilityDetails: EligibilityDetails = {
      flow: 'Sign Up',
      currentScreen: 'Job Details Screen',
    };
    expect(jobDetailsEvents.onBackClicked(eligibilityDetails)).toEqual({
      event: 'signup_click',
      params: {
        page_name: 'JobDetails',
        CTA: 'back',
      },
    });
  });

  it('returns renewal_select event for Renewal flow on back click', () => {
    const eligibilityDetails: EligibilityDetails = {
      flow: 'Renewal',
      currentScreen: 'Job Details Screen',
    };
    expect(jobDetailsEvents.onBackClicked(eligibilityDetails)).toEqual({
      event: 'renewal_click',
      params: {
        page_name: 'JobDetails',
        CTA: 'back',
      },
    });
  });
});
