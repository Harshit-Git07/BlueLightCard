import * as target from './GetOrganisations';
import { buildTestServiceLayerOrganisation } from '@/root/src/member-eligibility/shared/types/testing/BuildTestServiceLayerOrganisation';
import { fetchWithAuth } from '@/root/src/member-eligibility/shared/utils/FetchWithAuth';
window.fetch = jest.fn();

jest.mock('@/root/src/member-eligibility/shared/utils/FetchWithAuth', () => ({
  fetchWithAuth: jest.fn(),
}));

const serviceLayerOrganisation = [
  buildTestServiceLayerOrganisation({
    organisationId: '1',
    name: 'Employer 1',
  }),
];

describe('given service layer responses successfully', () => {
  beforeEach(() => {
    (fetchWithAuth as jest.Mock).mockResolvedValue(serviceLayerOrganisation);
  });

  it('should parse and return the payload successfully', async () => {
    const result = await target.getOrganisations();

    expect(fetchWithAuth).toHaveBeenCalledWith(expect.stringContaining('/orgs'));

    expect(result).toEqual(serviceLayerOrganisation);
  });
});

describe('given service layer fails to respond', () => {
  beforeEach(() => {
    (fetchWithAuth as jest.Mock).mockRejectedValue(new Error('Failed to fetch'));
  });

  it('should return undefined', async () => {
    const result = await target.getOrganisations();

    expect(fetchWithAuth).toHaveBeenCalledWith(expect.stringContaining('/orgs'));
    expect(result).toEqual(undefined);
  });
});
