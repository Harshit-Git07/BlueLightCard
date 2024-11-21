import { act, renderHook } from '@testing-library/react';
import * as target from './UseOnBack';
import { EligibilityDetails } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/types/EligibilityDetails';

type OnBackHookResult = ReturnType<typeof target.useOnBack>;

const setEligibilityDetailsMock = jest.fn();
let onBack: OnBackHookResult;

beforeEach(() => {
  jest.clearAllMocks();
});

describe('given user can skip ID verification', () => {
  beforeEach(() => {
    const initialEligibilityDetails: EligibilityDetails = {
      flow: 'Sign Up',
      currentScreen: 'Delivery Address Screen',
      canSkipIdVerification: true,
    };

    const { result: hookResult } = renderHook(() =>
      target.useOnBack([initialEligibilityDetails, setEligibilityDetailsMock])
    );

    onBack = hookResult.current;
  });

  it('should navigate to Job Details Screen', () => {
    act(() => {
      onBack();
    });

    expect(setEligibilityDetailsMock).toHaveBeenCalledWith({
      flow: 'Sign Up',
      canSkipIdVerification: true,
      currentScreen: 'Job Details Screen',
    });
  });
});

describe('given user cannot skip ID verification', () => {
  beforeEach(() => {
    const initialEligibilityDetails: EligibilityDetails = {
      flow: 'Sign Up',
      currentScreen: 'Delivery Address Screen',
      canSkipIdVerification: false,
    };

    const { result: hookResult } = renderHook(() =>
      target.useOnBack([initialEligibilityDetails, setEligibilityDetailsMock])
    );

    onBack = hookResult.current;
  });

  it('should navigate to Verification Method Screen', () => {
    act(() => {
      onBack();
    });

    expect(setEligibilityDetailsMock).toHaveBeenCalledWith({
      flow: 'Sign Up',
      canSkipIdVerification: false,
      currentScreen: 'Verification Method Screen',
    });
  });
});
