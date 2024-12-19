import { describe } from '@jest/globals';

import { GetVaultStockService } from '@blc-mono/redemptions/application/services/vaultStock/GetVaultStockService';
import { createSilentLogger } from '@blc-mono/redemptions/libs/test/helpers/logger';

describe('GetVaultStockController', () => {
  it('should return true when getVaultStock is called', () => {
    const service = new GetVaultStockService(createSilentLogger());
    const result = service.getVaultStock();
    expect(result).toStrictEqual(true);
  });
});
