import { renderHook } from '@testing-library/react';
import { EligibilityDetails } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/types/eligibliity-details/EligibilityDetails';
import * as target from './UseAccountDetailsIsValid';

jest.mock(
  '@/root/src/member-eligibility/sign-up/screens/delivery-address-screen/hooks/UseAddressIsValid',
  () => ({
    useAddressIsValid: () => true,
  })
);

const setEligibilityDetailsMock = jest.fn();
let result: boolean;

describe('given no member details exists', () => {
  const initialEligibilityDetails: EligibilityDetails = {
    flow: 'Sign Up',
    currentScreen: 'Delivery Address Screen',
    member: undefined,
  };

  beforeEach(() => {
    const { result: hookResult } = renderHook(() =>
      target.useAccountDetailsValid([initialEligibilityDetails, setEligibilityDetailsMock])
    );
    result = hookResult.current;
  });

  it('should return false', () => {
    expect(result).toBe(false);
  });
});

describe('given member details are entered', () => {
  describe('when the firstName is empty', () => {
    const initialEligibilityDetails: EligibilityDetails = {
      flow: 'Sign Up',
      currentScreen: 'Delivery Address Screen',
      member: {
        firstName: '  ',
        surname: 'Doe',
      },
    };

    beforeEach(() => {
      const { result: hookResult } = renderHook(() =>
        target.useAccountDetailsValid([initialEligibilityDetails, setEligibilityDetailsMock])
      );
      result = hookResult.current;
    });

    it('should return false', () => {
      expect(result).toBe(false);
    });
  });

  describe('when the surname is empty', () => {
    const initialEligibilityDetails: EligibilityDetails = {
      flow: 'Sign Up',
      currentScreen: 'Delivery Address Screen',
      member: {
        firstName: 'John',
        surname: '',
      },
    };

    beforeEach(() => {
      const { result: hookResult } = renderHook(() =>
        target.useAccountDetailsValid([initialEligibilityDetails, setEligibilityDetailsMock])
      );
      result = hookResult.current;
    });

    it('should return false', () => {
      expect(result).toBe(false);
    });
  });

  describe('given all member fields are filled', () => {
    const initialEligibilityDetails: EligibilityDetails = {
      flow: 'Sign Up',
      currentScreen: 'Delivery Address Screen',
      member: {
        firstName: 'John',
        surname: 'Doe',
        dob: new Date('1980-01-01'),
      },
    };

    beforeEach(() => {
      const { result: hookResult } = renderHook(() =>
        target.useAccountDetailsValid([initialEligibilityDetails, setEligibilityDetailsMock])
      );
      result = hookResult.current;
    });

    it('should return true', () => {
      expect(result).toBe(true);
    });
  });
});
