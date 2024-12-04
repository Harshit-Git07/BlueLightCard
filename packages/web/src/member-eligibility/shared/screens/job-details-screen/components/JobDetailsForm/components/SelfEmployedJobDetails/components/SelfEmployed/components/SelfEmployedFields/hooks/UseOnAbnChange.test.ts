import * as target from './UseOnAbnChange';
import { ChangeEvent, useCallback } from 'react';
import { EligibilityDetails } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/types/eligibliity-details/EligibilityDetails';

jest.mock('react');

const useCallbackMock = jest.mocked(useCallback);
const setEligibilityDetailsStateMock = jest.fn();

const eligibilityDetails: EligibilityDetails = {
  flow: 'Sign Up',
  currentScreen: 'Job Details Screen',
  jobDetailsAus: {
    australianBusinessNumber: '12345678901',
  },
};

type Result = ReturnType<typeof target.useOnAbnChange>;
let result: Result;

beforeEach(() => {
  useCallbackMock.mockImplementation((callback) => callback);
  setEligibilityDetailsStateMock.mockClear();
});

describe('useOnAbnChange', () => {
  beforeEach(() => {
    result = target.useOnAbnChange([eligibilityDetails, setEligibilityDetailsStateMock]);
  });

  it('should update ABN when changed', () => {
    const event = {
      target: {
        value: '98765432109',
      },
    } as ChangeEvent<HTMLInputElement>;

    result(event);

    expect(setEligibilityDetailsStateMock).toHaveBeenCalledWith({
      ...eligibilityDetails,
      jobDetailsAus: {
        ...eligibilityDetails.jobDetailsAus,
        australianBusinessNumber: '98765432109',
      },
    });
  });

  it('should maintain other jobDetailsAus fields when updating ABN', () => {
    const detailsWithEmployer = {
      ...eligibilityDetails,
      jobDetailsAus: {
        ...eligibilityDetails.jobDetailsAus,
        employerAus: 'Test Employer',
        isSelfEmployed: true,
      },
    };

    result = target.useOnAbnChange([detailsWithEmployer, setEligibilityDetailsStateMock]);

    const event = {
      target: {
        value: '98765432109',
      },
    } as ChangeEvent<HTMLInputElement>;

    result(event);

    expect(setEligibilityDetailsStateMock).toHaveBeenCalledWith({
      ...detailsWithEmployer,
      jobDetailsAus: {
        ...detailsWithEmployer.jobDetailsAus,
        australianBusinessNumber: '98765432109',
      },
    });
  });

  it('should update with empty ABN when cleared', () => {
    const event = {
      target: {
        value: '',
      },
    } as ChangeEvent<HTMLInputElement>;

    result(event);

    expect(setEligibilityDetailsStateMock).toHaveBeenCalledWith({
      ...eligibilityDetails,
      jobDetailsAus: {
        ...eligibilityDetails.jobDetailsAus,
        australianBusinessNumber: '',
      },
    });
  });
});
