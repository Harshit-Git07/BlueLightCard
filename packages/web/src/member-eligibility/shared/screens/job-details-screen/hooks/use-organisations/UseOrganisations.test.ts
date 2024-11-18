import * as target from './UseOrganisations';
import { renderHook, RenderHookResult, waitFor } from '@testing-library/react';
import { getOrganisations } from '@/root/src/member-eligibility/shared/screens/job-details-screen/hooks/use-organisations/service-layer/GetOrganisations';
import { EligibilityOrganisation } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/types/EligibilityDetails';

jest.mock(
  '@/root/src/member-eligibility/shared/screens/job-details-screen/hooks/use-organisations/service-layer/GetOrganisations'
);

const getOrganisationsMock = jest.mocked(getOrganisations);

type Result = ReturnType<typeof target.useOrganisations>;
let result: RenderHookResult<Result, unknown>['result'];

beforeEach(() => {
  jest.resetAllMocks();
  getOrganisationsMock.mockResolvedValue(undefined);
});

describe('given a list of organisations are returned from the service layer', () => {
  beforeEach(async () => {
    getOrganisationsMock.mockResolvedValue([
      { organisationId: 'from-service-layer', name: 'From service layer' },
    ]);

    const renderResult = renderHook(() => {
      return target.useOrganisations();
    });
    result = renderResult.result;
  });

  it('should return the result from the service layer', () => {
    waitFor(() => {
      expect(getOrganisationsMock).toHaveBeenCalled();
      expect(result.current).toEqual(<EligibilityOrganisation[]>[
        { id: 'from-service-layer', label: 'From service layer' },
      ]);
    });
  });
});
