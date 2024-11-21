import * as target from './UseAddressFieldUpdater';
import {
  ausAddressStub,
  ukAddressStub,
} from '@/root/src/member-eligibility/shared/screens/shared/components/ManualAddressForm/hooks/utils/AddressTestUtils';
import { renderHook } from '@testing-library/react';
import { EligibilityDetails } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/types/EligibilityDetails';

type Result = ReturnType<typeof target.useAddressFieldUpdater>;

const setEligibilityDetailsMock = jest.fn();
let setAddressField: Result;

beforeEach(() => {
  jest.clearAllMocks();
});

describe('given a UK address', () => {
  const initialEligibilityDetails: EligibilityDetails = {
    flow: 'Sign Up',
    currentScreen: 'Delivery Address Screen',
    address: ukAddressStub,
  };

  beforeEach(() => {
    const { result } = renderHook(() =>
      target.useAddressFieldUpdater([initialEligibilityDetails, setEligibilityDetailsMock])
    );
    setAddressField = result.current;
  });

  it('should update line1', () => {
    setAddressField('line1', '456 Baker St');

    expect(setEligibilityDetailsMock).toHaveBeenCalledWith({
      ...initialEligibilityDetails,
      address: {
        ...initialEligibilityDetails.address,
        line1: '456 Baker St',
      },
    });
  });

  it('should update line2', () => {
    setAddressField('line2', 'Flat C');

    expect(setEligibilityDetailsMock).toHaveBeenCalledWith({
      ...initialEligibilityDetails,
      address: {
        ...initialEligibilityDetails.address,
        line2: 'Flat C',
      },
    });
  });

  it('should update city', () => {
    setAddressField('city', 'Manchester');

    expect(setEligibilityDetailsMock).toHaveBeenCalledWith({
      ...initialEligibilityDetails,
      address: {
        ...initialEligibilityDetails.address,
        city: 'Manchester',
      },
    });
  });

  it('should update postcode', () => {
    setAddressField('postcode', 'M1 1AA');

    expect(setEligibilityDetailsMock).toHaveBeenCalledWith({
      ...initialEligibilityDetails,
      address: {
        ...initialEligibilityDetails.address,
        postcode: 'M1 1AA',
      },
    });
  });
});

describe('given an Australian address', () => {
  const initialEligibilityDetails: EligibilityDetails = {
    flow: 'Sign Up',
    currentScreen: 'Delivery Address Screen',
    address: ausAddressStub,
  };

  beforeEach(() => {
    const { result } = renderHook(() =>
      target.useAddressFieldUpdater([initialEligibilityDetails, setEligibilityDetailsMock])
    );
    setAddressField = result.current;
  });

  it('should update state', () => {
    setAddressField('state', 'VIC');

    expect(setEligibilityDetailsMock).toHaveBeenCalledWith({
      ...initialEligibilityDetails,
      address: {
        ...initialEligibilityDetails.address,
        state: 'VIC',
      },
    });
  });
});

describe('given no initial address', () => {
  const initialEligibilityDetails: EligibilityDetails = {
    flow: 'Sign Up',
    currentScreen: 'Delivery Address Screen',
    address: undefined,
  };

  beforeEach(() => {
    const { result } = renderHook(() =>
      target.useAddressFieldUpdater([initialEligibilityDetails, setEligibilityDetailsMock])
    );
    setAddressField = result.current;
  });

  it('should create new UK address with line1', () => {
    setAddressField('line1', '123 Baker St');

    expect(setEligibilityDetailsMock).toHaveBeenCalledWith({
      ...initialEligibilityDetails,
      address: {
        line1: '123 Baker St',
        line2: '',
        city: '',
        postcode: '',
      },
    });
  });

  it('should create new UK address with postcode', () => {
    setAddressField('postcode', 'NW1 6XE');

    expect(setEligibilityDetailsMock).toHaveBeenCalledWith({
      ...initialEligibilityDetails,
      address: {
        line1: '',
        line2: '',
        city: '',
        postcode: 'NW1 6XE',
      },
    });
  });
});
