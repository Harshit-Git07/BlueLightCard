import * as target from './UseEmployerChanged';
import { useCallback } from 'react';
import {
  EligibilityDetails,
  EligibilityEmployer,
} from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/types/eligibliity-details/EligibilityDetails';

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

it('should update eligibility details correctly for employer without multiple IDs', () => {
  const standardEmployer: EligibilityEmployer = {
    id: '1',
    label: 'Test Company',
    requireMultipleIds: false,
  };

  const result = target.useEmployerChanged([eligibilityDetails, setEligibilityDetailsStateMock]);
  result(standardEmployer);

  expect(setEligibilityDetailsStateMock).toHaveBeenCalledWith({
    ...eligibilityDetails,
    employer: standardEmployer,
    requireMultipleIds: standardEmployer.requireMultipleIds,
    currentIdRequirementDetails: standardEmployer.idRequirements,
  });
});

it('should update eligibility details correctly for employer with multiple IDs', () => {
  const multiIdEmployer: EligibilityEmployer = {
    id: '2',
    label: 'Another company',
    requireMultipleIds: true,
    idRequirements: [
      {
        title: 'Employee ID',
        description: 'Employee ID',
        guidelines: 'Upload a image of your employee ID',
        type: 'file upload',
        required: true,
      },
      {
        title: 'Employee Contract',
        description: 'Employee ID',
        guidelines: 'Upload a image of your Employee Contract',
        type: 'email',
        required: false,
      },
    ],
  };

  const result = target.useEmployerChanged([eligibilityDetails, setEligibilityDetailsStateMock]);
  result(multiIdEmployer);

  expect(setEligibilityDetailsStateMock).toHaveBeenCalledWith({
    ...eligibilityDetails,
    employer: multiIdEmployer,
    requireMultipleIds: multiIdEmployer.requireMultipleIds,
    currentIdRequirementDetails: multiIdEmployer.idRequirements,
  });
});

it('should preserve existing requireMultipleIds when employer value is null', () => {
  const employerWithoutMultipleIds: EligibilityEmployer = {
    id: '3',
    label: 'Third Company',
    requireMultipleIds: undefined,
  };

  const eligibilityDetailsWithMultipleIds = {
    ...eligibilityDetails,
    requireMultipleIds: true,
  };

  const result = target.useEmployerChanged([
    eligibilityDetailsWithMultipleIds,
    setEligibilityDetailsStateMock,
  ]);
  result(employerWithoutMultipleIds);

  expect(setEligibilityDetailsStateMock).toHaveBeenCalledWith({
    ...eligibilityDetailsWithMultipleIds,
    employer: employerWithoutMultipleIds,
    requireMultipleIds: true,
    currentIdRequirementDetails: employerWithoutMultipleIds.idRequirements,
  });
});
