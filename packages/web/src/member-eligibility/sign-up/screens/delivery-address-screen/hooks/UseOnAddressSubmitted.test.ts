import * as target from './UseOnAddressSubmitted';
import {
  ausAddressStub,
  ukAddressStub,
} from '@/root/src/member-eligibility/shared/screens/shared/components/ManualAddressForm/hooks/utils/AddressTestUtils';
import { renderHook } from '@testing-library/react';
import { EligibilityDetails } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/types/eligibliity-details/EligibilityDetails';
import { useLogAmplitudeEvent } from '@/root/src/member-eligibility/shared/utils/LogAmplitudeEvent';

jest.mock('@/root/src/member-eligibility/shared/utils/LogAmplitudeEvent');

const useLogAmplitudeEventMock = jest.mocked(useLogAmplitudeEvent);

const logAmplitudeEventMock = jest.fn();
const setEligibilityDetailsMock = jest.fn();

type Result = ReturnType<typeof target.useOnAddressSubmitted>;
let onAddressSubmitted: Result;

beforeEach(() => {
  jest.clearAllMocks();

  useLogAmplitudeEventMock.mockReturnValue(logAmplitudeEventMock);
});

describe('given no address exists', () => {
  beforeEach(() => {
    const initialEligibilityDetails: EligibilityDetails = {
      currentScreen: 'Delivery Address Screen',
      flow: 'Sign Up',
      address: undefined,
    };

    const { result } = renderHook(() =>
      target.useOnAddressSubmitted([initialEligibilityDetails, setEligibilityDetailsMock])
    );
    onAddressSubmitted = result.current;
  });

  it('should return false and not update eligibility details', () => {
    const returnValue = onAddressSubmitted();

    expect(returnValue).toBe(false);
    expect(setEligibilityDetailsMock).not.toHaveBeenCalled();
  });
});

describe('given a UK address with line2', () => {
  beforeEach(() => {
    const initialEligibilityDetails: EligibilityDetails = {
      currentScreen: 'Delivery Address Screen',
      flow: 'Sign Up',
      address: ukAddressStub,
    };

    const { result } = renderHook(() =>
      target.useOnAddressSubmitted([initialEligibilityDetails, setEligibilityDetailsMock])
    );
    onAddressSubmitted = result.current;
  });

  it('should update eligibility details with address and navigate to payment screen', () => {
    onAddressSubmitted();

    expect(setEligibilityDetailsMock).toHaveBeenCalledWith({
      currentScreen: 'Payment Screen',
      flow: 'Sign Up',
      address: ukAddressStub,
    });
  });
});

describe('given a UK address with empty line2', () => {
  beforeEach(() => {
    const initialEligibilityDetails: EligibilityDetails = {
      currentScreen: 'Delivery Address Screen',
      flow: 'Sign Up',
      address: {
        ...ukAddressStub,
        line2: '   ',
      },
    };

    const { result } = renderHook(() =>
      target.useOnAddressSubmitted([initialEligibilityDetails, setEligibilityDetailsMock])
    );
    onAddressSubmitted = result.current;
  });

  it('should update eligibility details without line2', () => {
    onAddressSubmitted();

    expect(setEligibilityDetailsMock).toHaveBeenCalledWith({
      currentScreen: 'Payment Screen',
      flow: 'Sign Up',
      address: {
        line1: ukAddressStub.line1,
        city: ukAddressStub.city,
        postcode: ukAddressStub.postcode,
      },
    });
  });
});

describe('given an Australian address with line2', () => {
  beforeEach(() => {
    const initialEligibilityDetails: EligibilityDetails = {
      currentScreen: 'Delivery Address Screen',
      flow: 'Sign Up',
      address: ausAddressStub,
    };

    const { result } = renderHook(() =>
      target.useOnAddressSubmitted([initialEligibilityDetails, setEligibilityDetailsMock])
    );
    onAddressSubmitted = result.current;
  });

  it('should update eligibility details with state and navigate to payment screen', () => {
    onAddressSubmitted();

    expect(setEligibilityDetailsMock).toHaveBeenCalledWith({
      currentScreen: 'Payment Screen',
      flow: 'Sign Up',
      address: ausAddressStub,
    });
  });
});

describe('given an Australian address with empty line2', () => {
  beforeEach(() => {
    const initialEligibilityDetails: EligibilityDetails = {
      currentScreen: 'Delivery Address Screen',
      flow: 'Sign Up',
      address: {
        ...ausAddressStub,
        line2: ' ',
      },
    };

    const { result } = renderHook(() =>
      target.useOnAddressSubmitted([initialEligibilityDetails, setEligibilityDetailsMock])
    );
    onAddressSubmitted = result.current;
  });

  it('should update eligibility details without line2', () => {
    onAddressSubmitted();

    expect(setEligibilityDetailsMock).toHaveBeenCalledWith({
      currentScreen: 'Payment Screen',
      flow: 'Sign Up',
      address: {
        line1: ausAddressStub.line1,
        city: ausAddressStub.city,
        state: ausAddressStub.state,
        postcode: ausAddressStub.postcode,
      },
    });
  });
});
