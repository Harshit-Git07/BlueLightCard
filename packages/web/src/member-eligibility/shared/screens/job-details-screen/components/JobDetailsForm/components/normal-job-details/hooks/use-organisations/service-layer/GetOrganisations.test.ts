import * as target from './GetOrganisations';
import { buildTestServiceLayerOrganisation } from '@/root/src/member-eligibility/shared/types/testing/BuildTestServiceLayerOrganisation';

window.fetch = jest.fn();

const fetchMock = jest.mocked(window.fetch);

const serviceLayerOrganisation = [
  buildTestServiceLayerOrganisation({
    organisationId: '1',
    name: 'Employer 1',
  }),
];

describe('given service layer responses successfully', () => {
  beforeEach(() => {
    fetchMock.mockResolvedValue({
      text: () => {
        return Promise.resolve(JSON.stringify(serviceLayerOrganisation));
      },
    } as Response);
  });

  it('should parse and return the payload successfully', async () => {
    const result = await target.getOrganisations();

    expect(fetchMock).toHaveBeenCalledWith('https://staging-members-api.blcshine.io/orgs');
    expect(result).toEqual(serviceLayerOrganisation);
  });
});

describe('given service layer fails to respond', () => {
  beforeEach(() => {
    fetchMock.mockRejectedValue(new Error('Failed to fetch'));
  });

  it('should return undefined', async () => {
    const result = await target.getOrganisations();

    expect(fetchMock).toHaveBeenCalledWith('https://staging-members-api.blcshine.io/orgs');
    expect(result).toEqual(undefined);
  });
});
