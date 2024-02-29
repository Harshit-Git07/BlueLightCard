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

  it('should request /newSearch api if experiment argument false', async () => {
    axiosMockRequest.mockResolvedValue({
      results: {},
    });

    const response = await makeSearch('apple', 'sasas', true, 'service', false);

    expect(axiosMockRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        url: 'https://mockdomain.co.uk/production/newSearch',
      })
    );
  });

  it('should request /expSearch api if experiment argument true', async () => {
    axiosMockRequest.mockResolvedValue({
      results: {},
    });

    const response = await makeSearch('apple', 'sasas', true, 'service', true);

    expect(axiosMockRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        url: 'https://mockdomain.co.uk/production/expSearch',
      })
    );
  });
});
