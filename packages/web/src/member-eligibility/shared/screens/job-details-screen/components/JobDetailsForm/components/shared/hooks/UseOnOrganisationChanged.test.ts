import * as target from './UseOnOrganisationChanged';
import { useCallback } from 'react';
import {
  EligibilityDetails,
  EligibilityOrganisation,
} from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/types/eligibliity-details/EligibilityDetails';
import { organisationMultiIdStub } from '@/root/src/member-eligibility/shared/screens/job-details-screen/components/JobDetailsForm/components/normal-job-details/hooks/use-organisations/stubs/OrganisationStubs';

jest.mock('react');

const useCallbackMock = jest.mocked(useCallback);

const eligibilityDetails: EligibilityDetails = {
  flow: 'Sign Up',
  currentScreen: 'Job Details Screen',
};
const setEligibilityDetailsStateMock = jest.fn();

const organisations: EligibilityOrganisation[] = [
  { id: '1', label: 'Test org', requiresJobTitle: true, requiresJobReference: false },
  organisationMultiIdStub,
];

type Result = ReturnType<typeof target.useOnOrganisationChanged>;
let callback: Result;

beforeEach(() => {
  useCallbackMock.mockImplementation((callback) => callback);
});

describe('given the organisation is changed', () => {
  beforeEach(() => {
    callback = target.useOnOrganisationChanged(
      [eligibilityDetails, setEligibilityDetailsStateMock],
      organisations
    );
    callback({ id: '1', label: 'Test org' });
  });

  it('should return update eligibility details object', () => {
    expect(setEligibilityDetailsStateMock).toHaveBeenCalledWith(<EligibilityDetails>{
      ...eligibilityDetails,
      organisation: {
        id: '1',
        label: 'Test org',
        requiresJobTitle: true,
        requiresJobReference: false,
      },
    });
  });
});

describe('given the organisation is changed to "Multi-ID stub"', () => {
  beforeEach(() => {
    callback = target.useOnOrganisationChanged(
      [eligibilityDetails, setEligibilityDetailsStateMock],
      organisations
    );
    callback(organisationMultiIdStub);
  });

  it('should return update eligibility details object', () => {
    expect(setEligibilityDetailsStateMock).toHaveBeenCalledWith(<EligibilityDetails>{
      ...eligibilityDetails,
      organisation: organisationMultiIdStub,
      currentIdRequirementDetails: organisationMultiIdStub.idRequirements,
    });
  });
});
