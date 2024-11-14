import * as target from './UseOnPromoCodeApplied';
import { useCallback } from 'react';
import { EligibilityDetails } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/types/EligibilityDetails';

jest.mock('react');

const useCallbackMock = jest.mocked(useCallback);
const setEligibilityDetailsStateMock = jest.fn();

const eligibilityDetails: EligibilityDetails = {
  flow: 'Sign Up',
  currentScreen: 'Job Details Screen',
};

beforeEach(() => {
  useCallbackMock.mockImplementation((callback) => callback);
});

it('should just return success', () => {
  const result = target.useOnPromoCodeApplied([
    eligibilityDetails,
    setEligibilityDetailsStateMock,
  ])();

  expect(result).toBe('Success');
});
