import { renderHook } from '@testing-library/react';
import * as target from './UseAddressIsValid';
import { ausAddressStub, ukAddressStub } from './utils/AddressTestUtils';
import { useIsAusBrand } from '@/root/src/member-eligibility/shared/hooks/use-is-aus-brand/UseIsAusBrand';

jest.mock('@/root/src/member-eligibility/shared/hooks/use-is-aus-brand/UseIsAusBrand');

const useIsAusBrandMock = jest.mocked(useIsAusBrand);

let result: boolean;

describe('given no address exists', () => {
  beforeEach(() => {
    useIsAusBrandMock.mockReturnValue(false);
    const { result: hookResult } = renderHook(() =>
      target.useAddressIsValid({
        currentScreen: 'Delivery Address Screen',
        flow: 'Sign Up',
        address: undefined,
      })
    );
    result = hookResult.current;
  });

  it('should return false', () => {
    expect(result).toBe(false);
  });
});

describe('given UK address validation', () => {
  describe('given all required fields are filled', () => {
    beforeEach(() => {
      useIsAusBrandMock.mockReturnValue(false);
      const { result: hookResult } = renderHook(() =>
        target.useAddressIsValid({
          currentScreen: 'Delivery Address Screen',
          flow: 'Sign Up',
          address: {
            line1: ukAddressStub.line1,
            city: ukAddressStub.city,
            postcode: ukAddressStub.postcode,
          },
        })
      );
      result = hookResult.current;
    });

    it('should return true', () => {
      expect(result).toBe(true);
    });
  });

  describe('given line1 is empty', () => {
    beforeEach(() => {
      const { result: hookResult } = renderHook(() =>
        target.useAddressIsValid({
          currentScreen: 'Delivery Address Screen',
          flow: 'Sign Up',
          address: {
            line1: '  ',
            city: ukAddressStub.city,
            postcode: ukAddressStub.postcode,
          },
        })
      );
      result = hookResult.current;
    });

    it('should return false', () => {
      expect(result).toBe(false);
    });
  });

  describe('given city is empty', () => {
    beforeEach(() => {
      const { result: hookResult } = renderHook(() =>
        target.useAddressIsValid({
          currentScreen: 'Delivery Address Screen',
          flow: 'Sign Up',
          address: {
            line1: ukAddressStub.line1,
            city: '',
            postcode: ukAddressStub.postcode,
          },
        })
      );
      result = hookResult.current;
    });

    it('should return false', () => {
      expect(result).toBe(false);
    });
  });

  describe('given postcode is empty', () => {
    beforeEach(() => {
      const { result: hookResult } = renderHook(() =>
        target.useAddressIsValid({
          currentScreen: 'Delivery Address Screen',
          flow: 'Sign Up',
          address: {
            line1: ukAddressStub.line1,
            city: ukAddressStub.city,
            postcode: '  ',
          },
        })
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
    beforeEach(() => {
      useIsAusBrandMock.mockReturnValue(true);
      const { result: hookResult } = renderHook(() =>
        target.useAddressIsValid({
          currentScreen: 'Delivery Address Screen',
          flow: 'Sign Up',
          address: {
            line1: ausAddressStub.line1,
            city: ausAddressStub.city,
            state: ausAddressStub.state,
            postcode: ausAddressStub.postcode,
          },
        })
      );
      result = hookResult.current;
    });

    it('should return true', () => {
      expect(result).toBe(true);
    });
  });

  describe('given address is missing state', () => {
    beforeEach(() => {
      const invalidAddress = {
        line1: ausAddressStub.line1,
        line2: ausAddressStub.line2,
        city: ausAddressStub.city,
        postcode: ausAddressStub.postcode,
      };
      const { result: hookResult } = renderHook(() =>
        target.useAddressIsValid({
          currentScreen: 'Delivery Address Screen',
          flow: 'Sign Up',
          address: invalidAddress,
        })
      );
      result = hookResult.current;
    });

    it('should return false', () => {
      expect(result).toBe(false);
    });
  });

  describe('given state is empty', () => {
    beforeEach(() => {
      const { result: hookResult } = renderHook(() =>
        target.useAddressIsValid({
          currentScreen: 'Delivery Address Screen',
          flow: 'Sign Up',
          address: {
            ...ausAddressStub,
            state: '  ',
          },
        })
      );
      result = hookResult.current;
    });

    it('should return false', () => {
      expect(result).toBe(false);
    });
  });

  describe('given line1 is empty', () => {
    beforeEach(() => {
      const { result: hookResult } = renderHook(() =>
        target.useAddressIsValid({
          currentScreen: 'Delivery Address Screen',
          flow: 'Sign Up',
          address: {
            ...ausAddressStub,
            line1: '',
          },
        })
      );
      result = hookResult.current;
    });

    it('should return false', () => {
      expect(result).toBe(false);
    });
  });
});
