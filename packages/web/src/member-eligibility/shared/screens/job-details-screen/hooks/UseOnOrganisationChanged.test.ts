import * as target from './UseOnOrganisationChanged';
import { useCallback } from 'react';
import { EligibilityDetails } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/types/EligibilityDetails';

jest.mock('react');

const useCallbackMock = jest.mocked(useCallback);
const setEligibilityDetailsStateMock = jest.fn();

const eligibilityDetails: EligibilityDetails = {
  flow: 'Sign Up',
  currentScreen: 'Job Details Screen',
};

type Result = ReturnType<typeof target.useOnOrganisationChanged>;
let result: Result;

beforeEach(() => {
  useCallbackMock.mockImplementation((callback) => callback);
});

describe('given the organisation is changed', () => {
  beforeEach(() => {
    result = target.useOnOrganisationChanged([eligibilityDetails, setEligibilityDetailsStateMock]);
    result('Test org');
  });

  it('should return update eligibility details object', () => {
    expect(setEligibilityDetailsStateMock).toHaveBeenCalledWith(<EligibilityDetails>{
      ...eligibilityDetails,
      organisation: 'Test org',
    });
  });
});

describe('given the organisation is changed to "Multi-ID stub"', () => {
  beforeEach(() => {
    result = target.useOnOrganisationChanged([eligibilityDetails, setEligibilityDetailsStateMock]);
    result('Multi-ID stub');
  });

  it('should return update eligibility details object', () => {
    expect(setEligibilityDetailsStateMock).toHaveBeenCalledWith(<EligibilityDetails>{
      ...eligibilityDetails,
      requireMultipleIds: true,
      organisation: 'Multi-ID stub',
    });
  });
});
