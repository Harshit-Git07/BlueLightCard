import * as target from './GetOrganisation';
import { buildTestServiceLayerOrganisation } from '@/root/src/member-eligibility/shared/types/testing/BuildTestServiceLayerOrganisation';

window.fetch = jest.fn();

const fetchMock = jest.mocked(window.fetch);

const serviceLayerOrganisations = [buildTestServiceLayerOrganisation()];

describe('given service layer responses successfully', () => {
  beforeEach(() => {
    fetchMock.mockResolvedValue({
      text: () => {
        return Promise.resolve(JSON.stringify(serviceLayerOrganisations));
      },
    } as Response);
  });

  it('should parse and return the payload successfully', async () => {
    const result = await target.getOrganisationFromServiceLayer('org-id');

    expect(fetchMock).toHaveBeenCalledWith('https://staging-members-api.blcshine.io/orgs/org-id');
    expect(result).toEqual(serviceLayerOrganisations);
  });
});

describe('given service layer fails to respond', () => {
  beforeEach(() => {
    fetchMock.mockRejectedValue(new Error('Failed to fetch'));
  });

  it('should return undefined', async () => {
    const result = await target.getOrganisationFromServiceLayer('org-id');

    expect(fetchMock).toHaveBeenCalledWith('https://staging-members-api.blcshine.io/orgs/org-id');
    expect(result).toEqual(undefined);
  });
});
