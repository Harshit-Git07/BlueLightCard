import * as target from './UseOnEmployerChange';
import { ChangeEvent, useCallback } from 'react';
import { EligibilityDetails } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/types/eligibliity-details/EligibilityDetails';

jest.mock('react');

const useCallbackMock = jest.mocked(useCallback);
const setEligibilityDetailsStateMock = jest.fn();

const eligibilityDetails: EligibilityDetails = {
  flow: 'Sign Up',
  currentScreen: 'Job Details Screen',
  jobDetailsAus: {
    employerAus: 'Initial Employer',
  },
};

type Result = ReturnType<typeof target.useOnEmployerChange>;
let result: Result;

beforeEach(() => {
  useCallbackMock.mockImplementation((callback) => callback);
  setEligibilityDetailsStateMock.mockClear();
});

describe('useOnEmployerChange', () => {
  beforeEach(() => {
    result = target.useOnEmployerChange([eligibilityDetails, setEligibilityDetailsStateMock]);
  });

  it('should update employer when changed', () => {
    const event = {
      target: {
        value: 'New Employer',
      },
    } as ChangeEvent<HTMLInputElement>;

    result(event);

    expect(setEligibilityDetailsStateMock).toHaveBeenCalledWith({
      ...eligibilityDetails,
      jobDetailsAus: {
        ...eligibilityDetails.jobDetailsAus,
        employerAus: 'New Employer',
      },
    });
  });

  it('should maintain other jobDetailsAus fields when updating employer', () => {
    const detailsWithAbn = {
      ...eligibilityDetails,
      jobDetailsAus: {
        ...eligibilityDetails.jobDetailsAus,
        australianBusinessNumber: '12345678901',
        isSelfEmployed: true,
      },
    };

    result = target.useOnEmployerChange([detailsWithAbn, setEligibilityDetailsStateMock]);

    const event = {
      target: {
        value: 'New Employer',
      },
    } as ChangeEvent<HTMLInputElement>;

    result(event);

    expect(setEligibilityDetailsStateMock).toHaveBeenCalledWith({
      ...detailsWithAbn,
      jobDetailsAus: {
        ...detailsWithAbn.jobDetailsAus,
        employerAus: 'New Employer',
      },
    });
  });

  it('should update with empty employer when cleared', () => {
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
        employerAus: '',
      },
    });
  });
});
