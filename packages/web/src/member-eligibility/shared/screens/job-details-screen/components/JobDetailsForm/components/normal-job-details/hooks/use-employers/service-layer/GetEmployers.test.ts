import * as target from './GetEmployers';
import { buildTestServiceLayerEmployer } from '@/root/src/member-eligibility/shared/types/testing/BuildTestServiceLayerEmployer';

import { fetchWithAuth } from '@/root/src/member-eligibility/shared/utils/FetchWithAuth';

jest.mock('@/root/src/member-eligibility/shared/utils/FetchWithAuth', () => ({
  fetchWithAuth: jest.fn(),
}));

const serviceLayerEmployers = [buildTestServiceLayerEmployer()];

describe('given service layer responses successfully', () => {
  beforeEach(() => {
    (fetchWithAuth as jest.Mock).mockResolvedValue(serviceLayerEmployers);
  });

  it('should parse and return the payload successfully', async () => {
    const result = await target.getEmployers('1');

    expect(fetchWithAuth).toHaveBeenCalledWith(expect.stringContaining('/employers'));
    expect(result).toEqual(serviceLayerEmployers);
  });
});

describe('given service layer fails to respond', () => {
  beforeEach(() => {
    (fetchWithAuth as jest.Mock).mockRejectedValue(new Error('Failed to fetch'));
  });

  it('should return undefined', async () => {
    const result = await target.getEmployers('1');

    expect(fetchWithAuth).toHaveBeenCalledWith(expect.stringContaining('/employers'));
    expect(result).toEqual(undefined);
  });
});
