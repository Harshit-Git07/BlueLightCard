import * as target from './GetEmployers';
import { buildTestServiceLayerEmployer } from '@/root/src/member-eligibility/shared/types/testing/BuildTestServiceLayerEmployer';

window.fetch = jest.fn();

const fetchMock = jest.mocked(window.fetch);

const serviceLayerEmployers = [buildTestServiceLayerEmployer()];

describe('given service layer responses successfully', () => {
  beforeEach(() => {
    fetchMock.mockResolvedValue({
      text: () => {
        return Promise.resolve(JSON.stringify(serviceLayerEmployers));
      },
    } as Response);
  });

  it('should parse and return the payload successfully', async () => {
    const result = await target.getEmployers('1');

    expect(fetchMock).toHaveBeenCalledWith(
      'https://staging-members-api.blcshine.io/orgs/1/employers'
    );
    expect(result).toEqual(serviceLayerEmployers);
  });
});

describe('given service layer fails to respond', () => {
  beforeEach(() => {
    fetchMock.mockRejectedValue(new Error('Failed to fetch'));
  });

  it('should return undefined', async () => {
    const result = await target.getEmployers('1');

    expect(fetchMock).toHaveBeenCalledWith(
      'https://staging-members-api.blcshine.io/orgs/1/employers'
    );
    expect(result).toEqual(undefined);
  });
});
