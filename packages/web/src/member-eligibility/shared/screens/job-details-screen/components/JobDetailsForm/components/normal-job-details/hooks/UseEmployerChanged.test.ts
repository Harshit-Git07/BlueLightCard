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

it('should update eligibility details correctly', () => {
  const standardEmployer: EligibilityEmployer = {
    id: '1',
    label: 'Test Company',
    requiresJobTitle: true,
    requiresJobReference: false,
    idRequirements: [
      {
        title: 'Employee ID',
        description: 'Employee ID',
        guidelines: 'Upload a image of your employee ID',
        type: 'file upload',
        required: false,
      },
    ],
  };

  const callback = target.useEmployerChanged(
    [eligibilityDetails, setEligibilityDetailsStateMock],
    [standardEmployer]
  );
  callback(standardEmployer);

  expect(setEligibilityDetailsStateMock).toHaveBeenCalledWith(<EligibilityDetails>{
    ...eligibilityDetails,
    employer: standardEmployer,
    currentIdRequirementDetails: standardEmployer.idRequirements,
  });
});
