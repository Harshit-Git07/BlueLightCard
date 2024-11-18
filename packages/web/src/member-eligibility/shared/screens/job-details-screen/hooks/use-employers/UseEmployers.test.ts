import * as target from './UseEmployers';
import { organisationNoEmployersStub } from '@/root/src/member-eligibility/shared/screens/job-details-screen/hooks/use-organisations/stubs/OrganisationStubs';
import { renderHook, RenderHookResult, waitFor } from '@testing-library/react';
import { getEmployers } from '@/root/src/member-eligibility/shared/screens/job-details-screen/hooks/use-employers/service-layer/GetEmployers';
import { EligibilityEmployer } from '@/root/src/member-eligibility/shared/screens/job-details-screen/hooks/use-employers/types/EligibilityEmployer';
import { v4 as createUuid } from 'uuid';

jest.mock(
  '@/root/src/member-eligibility/shared/screens/job-details-screen/hooks/use-employers/service-layer/GetEmployers'
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
    const renderResult = renderHook(() => target.useEmployers(undefined));
    result = renderResult.result;
  });

  it('should return stub list of employers', () => {
    expect(result.current).toBeUndefined();
  });
});

describe('given a list of employers are returned from the service layer', () => {
  beforeEach(async () => {
    getEmployersMock.mockResolvedValue([
      { employerId: 'from-service-layer', name: 'From service layer' },
    ]);

    const renderResult = renderHook(() => {
      return target.useEmployers({ id: createUuid(), label: 'From Service Layer' });
    });
    result = renderResult.result;
  });

  it('should return the result from the service layer', () => {
    waitFor(() => {
      expect(getEmployersMock).toHaveBeenCalled();
      expect(result.current).toEqual(<EligibilityEmployer[]>[{ id: '1', label: 'Employer 1' }]);
    });
  });
});

// TODO: This should be removed later and instead use some kind of service layer info to decide
describe('given the organisation is the empty employers stub', () => {
  beforeEach(() => {
    const renderResult = renderHook(() => target.useEmployers(organisationNoEmployersStub));
    result = renderResult.result;
  });

  it('should return stub empty list of employers', () => {
    expect(result.current).toEqual([]);
  });
});

// TODO: This can be removed once service layer is fully integrated
describe('given the organisation id is not a uuid', () => {
  beforeEach(() => {
    const renderResult = renderHook(() =>
      target.useEmployers({ id: '1', label: 'Organisation 1' })
    );
    result = renderResult.result;
  });

  it('should return stub list of employers', () => {
    expect(result.current).toEqual(<Result>[
      { id: '1', label: 'Employer 1' },
      { id: '2', label: 'Employer 2' },
      { id: '3', label: 'Employer 3' },
    ]);
  });
});
