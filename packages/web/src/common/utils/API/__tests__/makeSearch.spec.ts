import axios from 'axios';
import { makeSearch } from '../makeSearch';

jest.mock('axios', () => ({
  request: jest.fn(),
}));

jest.mock('@/global-vars', () => ({
  BRAND: 'blc-uk',
  SEARCH_ENDPOINT: 'https://mockdomain.co.uk/production',
}));

describe('Search api requests', () => {
  let axiosMockRequest: jest.Mock;

  beforeEach(() => {
    axiosMockRequest = axios.request as jest.Mock;
  });

  it('should request /expSearch api', async () => {
    axiosMockRequest.mockResolvedValue({
      results: {},
    });

    await makeSearch('apple', 'sasas', true, 'service');

    expect(axiosMockRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        url: 'https://mockdomain.co.uk/production/expSearch',
      })
    );
  });
});
