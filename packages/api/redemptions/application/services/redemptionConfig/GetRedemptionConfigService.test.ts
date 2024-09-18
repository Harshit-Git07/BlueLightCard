import { createTestLogger } from '@blc-mono/redemptions/libs/test/helpers/logger';

import { GetRedemptionConfigService } from './GetRedemptionConfigService';

const mockLogger = createTestLogger();
const getRedemptionConfigService = new GetRedemptionConfigService(mockLogger);

describe('GetRedemptionConfigService', () => {
  it('should return response', () => {
    const offerId = 'offerId';
    const result = getRedemptionConfigService.getRedemption(offerId);

    expect(result).toEqual({
      kind: 'Ok',
      data: {
        offerId,
      },
    });
  });
});
