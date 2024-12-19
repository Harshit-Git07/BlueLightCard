import { faker } from '@faker-js/faker';
import { describe } from '@jest/globals';

import { UnknownScheduledEvent } from '@blc-mono/redemptions/application/controllers/cron/CronController';
import { IGetVaultStockService } from '@blc-mono/redemptions/application/services/vaultStock/GetVaultStockService';
import { createSilentLogger } from '@blc-mono/redemptions/libs/test/helpers/logger';

import { GetVaultStockController } from './GetVaultStockController';

describe('GetVaultStockController', () => {
  describe('invoke', () => {
    it('should invoke the handle method', async () => {
      const logger = createSilentLogger();
      const service = {
        getVaultStock: jest.fn(),
      } satisfies IGetVaultStockService;
      const controller = new GetVaultStockController(logger, service);
      const mockEvent = {
        source: 'aws.events',
        'detail-type': 'Scheduled Event',
        account: faker.string.numeric(),
        id: faker.string.uuid(),
        time: faker.date.recent().toISOString(),
        region: faker.helpers.arrayElement(['eu-west-2', 'ap-southeast-2']),
        resources: [],
        version: faker.string.numeric(),
        detail: {},
      } satisfies UnknownScheduledEvent;

      await controller.invoke(mockEvent);

      expect(service.getVaultStock).toHaveBeenCalled();
    });
  });
});
