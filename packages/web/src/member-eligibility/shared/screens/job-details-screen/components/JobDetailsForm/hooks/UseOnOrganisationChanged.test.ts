import * as target from './UseOnOrganisationChanged';
import { useCallback } from 'react';
import {
  EligibilityDetails,
  EligibilityOrganisation,
} from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/types/eligibliity-details/EligibilityDetails';
import { organisationMultiIdStub } from '@/root/src/member-eligibility/shared/screens/job-details-screen/components/JobDetailsForm/hooks/use-organisations/stubs/OrganisationStubs';

jest.mock('react');

const useCallbackMock = jest.mocked(useCallback);
const setEligibilityDetailsStateMock = jest.fn();

const eligibilityDetails: EligibilityDetails = {
  flow: 'Sign Up',
  currentScreen: 'Job Details Screen',
};

beforeAll(() => {
  useCallbackMock.mockImplementation((callback) => callback);
});

beforeEach(() => {
  jest.clearAllMocks();
});

it('should update eligibility details correctly for standard organisation', () => {
  const standardOrganisation: EligibilityOrganisation = {
    id: '1',
    label: 'Test org',
    requireMultipleIds: false,
  };

  const result = target.useOnOrganisationChanged([
    eligibilityDetails,
    setEligibilityDetailsStateMock,
  ]);
  result(standardOrganisation);

  expect(setEligibilityDetailsStateMock).toHaveBeenCalledWith({
    ...eligibilityDetails,
    employer: undefined,
    jobTitle: undefined,
    organisation: standardOrganisation,
    requireMultipleIds: standardOrganisation.requireMultipleIds,
    currentIdRequirementDetails: standardOrganisation.idRequirements,
  });
});

it('should update eligibility details correctly for multi-ID organisation', () => {
  const result = target.useOnOrganisationChanged([
    eligibilityDetails,
    setEligibilityDetailsStateMock,
  ]);
  result(organisationMultiIdStub);

  expect(setEligibilityDetailsStateMock).toHaveBeenCalledWith({
    ...eligibilityDetails,
    employer: undefined,
    jobTitle: undefined,
    requireMultipleIds: true,
    organisation: organisationMultiIdStub,
    currentIdRequirementDetails: organisationMultiIdStub.idRequirements,
  });
});
