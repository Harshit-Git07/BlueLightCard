import * as target from './GetOrganisation';
import { buildTestServiceLayerOrganisation } from '@/root/src/member-eligibility/shared/types/testing/BuildTestServiceLayerOrganisation';

import { fetchWithAuth } from '@/root/src/member-eligibility/shared/utils/FetchWithAuth';

jest.mock('@/root/src/member-eligibility/shared/utils/FetchWithAuth', () => ({
  fetchWithAuth: jest.fn(),
}));

const serviceLayerOrganisations = [buildTestServiceLayerOrganisation()];

describe('given service layer responses successfully', () => {
  beforeEach(() => {
    (fetchWithAuth as jest.Mock).mockResolvedValue(serviceLayerOrganisations);
  });

  it('should parse and return the payload successfully', async () => {
    const result = await target.getOrganisationFromServiceLayer('org-id');

    expect(fetchWithAuth).toHaveBeenCalledWith(expect.stringContaining('/orgs/org-id'));
    expect(result).toEqual(serviceLayerOrganisations);
  });
});

describe('given service layer fails to respond', () => {
  beforeEach(() => {
    (fetchWithAuth as jest.Mock).mockRejectedValue(new Error('Failed to fetch'));
  });

  it('should return undefined', async () => {
    const result = await target.getOrganisationFromServiceLayer('org-id');

    expect(fetchWithAuth).toHaveBeenCalledWith(expect.stringContaining('/orgs/org-id'));
    expect(result).toEqual(undefined);
  });
});
