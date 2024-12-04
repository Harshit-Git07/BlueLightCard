import * as target from './GetOrganisations';
import { ServiceLayerOrganisation } from '@/root/src/member-eligibility/shared/types/ServiceLayerOrganisation';

window.fetch = jest.fn();

const fetchMock = jest.mocked(window.fetch);

const serviceLayerEmployers: ServiceLayerOrganisation[] = [
  {
    organisationId: '1',
    name: 'Employer 1',
  },
];

describe('given service layer responses successfully', () => {
  beforeEach(() => {
    fetchMock.mockResolvedValue({
      text: () => {
        return Promise.resolve(JSON.stringify(serviceLayerEmployers));
      },
    } as Response);
  });

  it('should parse and return the payload successfully', async () => {
    const result = await target.getOrganisations();

    expect(fetchMock).toHaveBeenCalledWith(
      'https://kbb684h8h8.execute-api.eu-west-2.amazonaws.com/v1/orgs'
    );
    expect(result).toEqual(serviceLayerEmployers);
  });
});

describe('given service layer fails to respond', () => {
  beforeEach(() => {
    fetchMock.mockRejectedValue(new Error('Failed to fetch'));
  });

  it('should return undefined', async () => {
    const result = await target.getOrganisations();

    expect(fetchMock).toHaveBeenCalledWith(
      'https://kbb684h8h8.execute-api.eu-west-2.amazonaws.com/v1/orgs'
    );
    expect(result).toEqual(undefined);
  });
});
