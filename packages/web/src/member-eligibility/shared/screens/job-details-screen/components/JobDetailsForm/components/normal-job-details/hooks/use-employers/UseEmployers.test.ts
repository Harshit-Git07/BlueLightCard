import * as target from './UseEmployers';
import { renderHook, RenderHookResult, waitFor } from '@testing-library/react';
import { v4 as createUuid } from 'uuid';
import { buildTestEligibilityDetails } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/types/eligibliity-details/testing/BuildTestEligibilityDetails';
import { EligibilityEmployer } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/types/eligibliity-details/EligibilityDetails';
import { buildTestServiceLayerEmployer } from '@/root/src/member-eligibility/shared/types/testing/BuildTestServiceLayerEmployer';
import { getEmployers } from '@/root/src/member-eligibility/shared/screens/job-details-screen/components/JobDetailsForm/components/normal-job-details/hooks/use-employers/service-layer/GetEmployers';
import { organisationNoEmployersStub } from '@/root/src/member-eligibility/shared/screens/job-details-screen/components/JobDetailsForm/components/normal-job-details/hooks/use-organisations/stubs/OrganisationStubs';

jest.mock(
  '@/root/src/member-eligibility/shared/screens/job-details-screen/components/JobDetailsForm/components/normal-job-details/hooks/use-employers/service-layer/GetEmployers'
);

const getEmployersMock = jest.mocked(getEmployers);

type Result = ReturnType<typeof target.useEmployers>;
let result: RenderHookResult<Result, unknown>['result'];

beforeEach(() => {
  jest.resetAllMocks();
  getEmployersMock.mockResolvedValue(undefined);
});

describe('given the organisation is undefined', () => {
  beforeEach(() => {
    const renderResult = renderHook(() => target.useEmployers(buildTestEligibilityDetails()));
    result = renderResult.result;
  });

  it('should return stub list of employers', () => {
    expect(result.current).toBeUndefined();
  });
});

describe('given a list of employers are returned from the service layer', () => {
  beforeEach(async () => {
    getEmployersMock.mockResolvedValue([
      buildTestServiceLayerEmployer({
        employerId: 'from-service-layer',
        name: 'From service layer',
      }),
    ]);

    const renderResult = renderHook(() => {
      return target.useEmployers(
        buildTestEligibilityDetails({
          organisation: {
            id: createUuid(),
            label: 'From Service Layer',
            requiresJobTitle: true,
            requiresJobReference: false,
          },
        })
      );
    });
    result = renderResult.result;
  });

  it('should return the result from the service layer', () => {
    waitFor(() => {
      expect(getEmployersMock).toHaveBeenCalled();
      expect(result.current).toEqual(<EligibilityEmployer[]>[
        {
          id: '1',
          label: 'Employer 1',
        },
      ]);
    });
  });
});

// TODO: This should be removed later and instead use some kind of service layer info to decide
describe('given the organisation is the empty employers stub', () => {
  beforeEach(() => {
    const renderResult = renderHook(() => {
      return target.useEmployers(
        buildTestEligibilityDetails({
          organisation: organisationNoEmployersStub,
        })
      );
    });
    result = renderResult.result;
  });

  it('should return stub empty list of employers', () => {
    expect(result.current).toEqual([]);
  });
});

// TODO: This can be removed once service layer is fully integrated
describe('given the organisation id is not a uuid', () => {
  beforeEach(() => {
    const renderResult = renderHook(() => {
      return target.useEmployers(
        buildTestEligibilityDetails({
          organisation: {
            id: '1',
            label: 'Organisation 1',
            requiresJobTitle: true,
            requiresJobReference: false,
          },
        })
      );
    });
    result = renderResult.result;
  });

  it('should return stub list of employers', () => {
    expect(result.current).toEqual(<Result>[
      {
        id: '1',
        label: 'Employer 1',
        requiresJobTitle: true,
        requiresJobReference: false,
      },
      {
        id: '2',
        label: 'Employer 2',
        requiresJobTitle: true,
        requiresJobReference: false,
      },
      {
        id: '3',
        label: 'Employer 3',
        requiresJobTitle: true,
        requiresJobReference: false,
      },
    ]);
  });
});
