import * as target from './GetOrganisation';
import { ServiceLayerOrganisation } from '@/root/src/member-eligibility/shared/types/ServiceLayerOrganisation';

window.fetch = jest.fn();

const fetchMock = jest.mocked(window.fetch);

const serviceLayerOrganisations: ServiceLayerOrganisation[] = [
  {
    organisationId: '1',
    name: 'Employer 1',
  },
];

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

    expect(fetchMock).toHaveBeenCalledWith(
      'https://kbb684h8h8.execute-api.eu-west-2.amazonaws.com/v1/orgs/org-id'
    );
    expect(result).toEqual(serviceLayerOrganisations);
  });
});

describe('given service layer fails to respond', () => {
  beforeEach(() => {
    fetchMock.mockRejectedValue(new Error('Failed to fetch'));
  });

  it('should return undefined', async () => {
    const result = await target.getOrganisationFromServiceLayer('org-id');

    expect(fetchMock).toHaveBeenCalledWith(
      'https://kbb684h8h8.execute-api.eu-west-2.amazonaws.com/v1/orgs/org-id'
    );
    expect(result).toEqual(undefined);
  });
});
