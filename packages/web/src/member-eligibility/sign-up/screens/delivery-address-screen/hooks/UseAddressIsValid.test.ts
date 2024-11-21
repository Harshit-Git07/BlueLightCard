import { renderHook } from '@testing-library/react';
import * as target from './UseAddressIsValid';
import {
  ausAddressStub,
  ukAddressStub,
} from '../../../../shared/screens/shared/components/ManualAddressForm/hooks/utils/AddressTestUtils';
import { useIsAusBrand } from '@/root/src/member-eligibility/shared/hooks/use-is-aus-brand/UseIsAusBrand';
import { EligibilityDetails } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/types/EligibilityDetails';

jest.mock('@/root/src/member-eligibility/shared/hooks/use-is-aus-brand/UseIsAusBrand');

const useIsAusBrandMock = jest.mocked(useIsAusBrand);
let result: boolean;
const setEligibilityDetailsMock = jest.fn();

describe('given no address exists', () => {
  const initialEligibilityDetails: EligibilityDetails = {
    flow: 'Sign Up',
    currentScreen: 'Delivery Address Screen',
    address: undefined,
  };

  beforeEach(() => {
    useIsAusBrandMock.mockReturnValue(false);
    const { result: hookResult } = renderHook(() =>
      target.useAddressIsValid([initialEligibilityDetails, setEligibilityDetailsMock])
    );
    result = hookResult.current;
  });

  it('should return false', () => {
    expect(result).toBe(false);
  });
});

describe('given UK address validation', () => {
  describe('given all required fields are filled', () => {
    const initialEligibilityDetails: EligibilityDetails = {
      flow: 'Sign Up',
      currentScreen: 'Delivery Address Screen',
      address: {
        line1: ukAddressStub.line1,
        city: ukAddressStub.city,
        postcode: ukAddressStub.postcode,
      },
    };

    beforeEach(() => {
      useIsAusBrandMock.mockReturnValue(false);
      const { result: hookResult } = renderHook(() =>
        target.useAddressIsValid([initialEligibilityDetails, setEligibilityDetailsMock])
      );
      result = hookResult.current;
    });

    it('should return true', () => {
      expect(result).toBe(true);
    });
  });

  describe('given line1 is empty', () => {
    const initialEligibilityDetails: EligibilityDetails = {
      flow: 'Sign Up',
      currentScreen: 'Delivery Address Screen',
      address: {
        line1: '  ',
        city: ukAddressStub.city,
        postcode: ukAddressStub.postcode,
      },
    };

    beforeEach(() => {
      const { result: hookResult } = renderHook(() =>
        target.useAddressIsValid([initialEligibilityDetails, setEligibilityDetailsMock])
      );
      result = hookResult.current;
    });

    it('should return false', () => {
      expect(result).toBe(false);
    });
  });

  describe('given city is empty', () => {
    const initialEligibilityDetails: EligibilityDetails = {
      flow: 'Sign Up',
      currentScreen: 'Delivery Address Screen',
      address: {
        line1: ukAddressStub.line1,
        city: '',
        postcode: ukAddressStub.postcode,
      },
    };

    beforeEach(() => {
      const { result: hookResult } = renderHook(() =>
        target.useAddressIsValid([initialEligibilityDetails, setEligibilityDetailsMock])
      );
      result = hookResult.current;
    });

    it('should return false', () => {
      expect(result).toBe(false);
    });
  });

  describe('given postcode is empty', () => {
    const initialEligibilityDetails: EligibilityDetails = {
      flow: 'Sign Up',
      currentScreen: 'Delivery Address Screen',
      address: {
        line1: ukAddressStub.line1,
        city: ukAddressStub.city,
        postcode: '  ',
      },
    };

    beforeEach(() => {
      const { result: hookResult } = renderHook(() =>
        target.useAddressIsValid([initialEligibilityDetails, setEligibilityDetailsMock])
      );
      result = hookResult.current;
    });

    it('should return false', () => {
      expect(result).toBe(false);
    });
  });
});

describe('given Australian address validation', () => {
  describe('given all required fields are filled', () => {
    const initialEligibilityDetails: EligibilityDetails = {
      flow: 'Sign Up',
      currentScreen: 'Delivery Address Screen',
      address: {
        line1: ausAddressStub.line1,
        city: ausAddressStub.city,
        state: ausAddressStub.state,
        postcode: ausAddressStub.postcode,
      },
    };

    beforeEach(() => {
      useIsAusBrandMock.mockReturnValue(true);
      const { result: hookResult } = renderHook(() =>
        target.useAddressIsValid([initialEligibilityDetails, setEligibilityDetailsMock])
      );
      result = hookResult.current;
    });

    it('should return true', () => {
      expect(result).toBe(true);
    });
  });

  describe('given address is missing state', () => {
    const initialEligibilityDetails: EligibilityDetails = {
      flow: 'Sign Up',
      currentScreen: 'Delivery Address Screen',
      address: {
        line1: ausAddressStub.line1,
        line2: ausAddressStub.line2,
        city: ausAddressStub.city,
        postcode: ausAddressStub.postcode,
      },
    };

    beforeEach(() => {
      const { result: hookResult } = renderHook(() =>
        target.useAddressIsValid([initialEligibilityDetails, setEligibilityDetailsMock])
      );
      result = hookResult.current;
    });

    it('should return false', () => {
      expect(result).toBe(false);
    });
  });

  describe('given state is empty', () => {
    const initialEligibilityDetails: EligibilityDetails = {
      flow: 'Sign Up',
      currentScreen: 'Delivery Address Screen',
      address: {
        ...ausAddressStub,
        state: '  ',
      },
    };

    beforeEach(() => {
      const { result: hookResult } = renderHook(() =>
        target.useAddressIsValid([initialEligibilityDetails, setEligibilityDetailsMock])
      );
      result = hookResult.current;
    });

    it('should return false', () => {
      expect(result).toBe(false);
    });
  });

  describe('given line1 is empty', () => {
    const initialEligibilityDetails: EligibilityDetails = {
      flow: 'Sign Up',
      currentScreen: 'Delivery Address Screen',
      address: {
        ...ausAddressStub,
        line1: '',
      },
    };

    beforeEach(() => {
      const { result: hookResult } = renderHook(() =>
        target.useAddressIsValid([initialEligibilityDetails, setEligibilityDetailsMock])
      );
      result = hookResult.current;
    });

    it('should return false', () => {
      expect(result).toBe(false);
    });
  });
});
