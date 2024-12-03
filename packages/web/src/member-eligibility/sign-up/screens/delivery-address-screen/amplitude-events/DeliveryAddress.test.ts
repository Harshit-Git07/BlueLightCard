import { deliveryAddressEvents } from './DeliveryAddress';
import { EligibilityDetails } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/types/eligibliity-details/EligibilityDetails';

describe('deliveryAddressEvents', () => {
  it('returns signup_click event for Sign Up flow on back click', () => {
    const eligibilityDetails: EligibilityDetails = {
      flow: 'Sign Up',
      currentScreen: 'Delivery Address Screen',
      canSkipIdVerification: false,
    };
    expect(deliveryAddressEvents.onBackClicked(eligibilityDetails)).toEqual({
      event: 'signup_click',
      params: {
        page_name: 'DeliveryAddress',
        CTA: 'back',
      },
    });
  });

  it('returns renewal_click event for Renewal flow on back click', () => {
    const eligibilityDetails: EligibilityDetails = {
      flow: 'Renewal',
      currentScreen: 'Delivery Address Screen',
      canSkipIdVerification: false,
    };
    expect(deliveryAddressEvents.onBackClicked(eligibilityDetails)).toEqual({
      event: 'renewal_click',
      params: {
        page_name: 'DeliveryAddress',
        CTA: 'back',
      },
    });
  });

  it('returns signup_click event for Sign Up flow on finish click', () => {
    const eligibilityDetails: EligibilityDetails = {
      flow: 'Sign Up',
      currentScreen: 'Delivery Address Screen',
      canSkipIdVerification: false,
    };
    expect(deliveryAddressEvents.onFinishClicked(eligibilityDetails)).toEqual({
      event: 'signup_click',
      params: {
        page_name: 'DeliveryAddress',
        CTA: 'finish',
      },
    });
  });

  it('returns renewal_click event for Renewal flow on finish click', () => {
    const eligibilityDetails: EligibilityDetails = {
      flow: 'Renewal',
      currentScreen: 'Delivery Address Screen',
      canSkipIdVerification: false,
    };
    expect(deliveryAddressEvents.onFinishClicked(eligibilityDetails)).toEqual({
      event: 'renewal_click',
      params: {
        page_name: 'DeliveryAddress',
        CTA: 'finish',
      },
    });
  });
});
