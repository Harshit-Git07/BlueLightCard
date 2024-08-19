import { faker } from '@faker-js/faker';
import { describe } from '@jest/globals';

import { as } from '@blc-mono/core/utils/testing';
import { UnknownEventBridgeEvent } from '@blc-mono/redemptions/application/controllers/eventBridge/EventBridgeController';
import { IVaultBatchCreatedService } from '@blc-mono/redemptions/application/services/vaultBatch/VaultBatchCreatedService';
import {
  RedemptionsVaultBatchEvents,
  UPLOAD_FILE_TYPE,
} from '@blc-mono/redemptions/infrastructure/eventBridge/events/vaultBatch';
import { createTestLogger } from '@blc-mono/redemptions/libs/test/helpers/logger';

import { VaultBatchCreatedController } from './VaultBatchCreatedController';

describe('VaultBatchCreatedController', () => {
  describe('invoke', () => {
    it('should call the VaultBatchCreatedService correctly', async () => {
      const testLogger = createTestLogger();
      const service = {
        vaultBatchCreated: jest.fn(),
      } satisfies Partial<IVaultBatchCreatedService>;
      const controller = new VaultBatchCreatedController(testLogger, as(service));
      const mockEvent = {
        source: RedemptionsVaultBatchEvents.BATCH_CREATED,
        'detail-type': RedemptionsVaultBatchEvents.BATCH_CREATED_DETAIL,
        account: faker.string.numeric(),
        id: faker.string.uuid(),
        time: faker.date.recent().toISOString(),
        region: faker.helpers.arrayElement(['eu-west-2', 'ap-southeast-2']),
        resources: [],
        version: faker.string.numeric(),
        detail: {
          vaultId: `vlt-${faker.string.uuid()}`,
          batchId: `vbt-${faker.string.uuid()}`,
          fileName: `test${UPLOAD_FILE_TYPE}`,
          countCodeInsertSuccess: 10,
          countCodeInsertFail: 2,
          codeInsertFailArray: ['code_01', 'code_02'],
        },
      } satisfies UnknownEventBridgeEvent;

      await controller.invoke(mockEvent);

      expect(service.vaultBatchCreated).toHaveBeenCalledTimes(1);
    });
  });
});
