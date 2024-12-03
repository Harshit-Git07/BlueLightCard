import * as target from './UseOnOrganisationChanged';
import { useCallback } from 'react';
import { EligibilityDetails } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/types/eligibliity-details/EligibilityDetails';
import { organisationMultiIdStub } from '@/root/src/member-eligibility/shared/screens/job-details-screen/hooks/use-organisations/stubs/OrganisationStubs';

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
    result({ id: '1', label: 'Test org' });
  });

  it('should return update eligibility details object', () => {
    expect(setEligibilityDetailsStateMock).toHaveBeenCalledWith(<EligibilityDetails>{
      ...eligibilityDetails,
      organisation: { id: '1', label: 'Test org' },
    });
  });
});

describe('given the organisation is changed to "Multi-ID stub"', () => {
  beforeEach(() => {
    result = target.useOnOrganisationChanged([eligibilityDetails, setEligibilityDetailsStateMock]);
    result(organisationMultiIdStub);
  });

  it('should return update eligibility details object', () => {
    expect(setEligibilityDetailsStateMock).toHaveBeenCalledWith(<EligibilityDetails>{
      ...eligibilityDetails,
      requireMultipleIds: true,
      organisation: organisationMultiIdStub,
    });
  });
});
