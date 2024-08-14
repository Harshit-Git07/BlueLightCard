import { faker } from '@faker-js/faker';
import { describe } from '@jest/globals';

import { as } from '@blc-mono/core/utils/testing';
import { UnknownEventBridgeEvent } from '@blc-mono/redemptions/application/controllers/eventBridge/EventBridgeController';
import { IVaultCodesUploadService } from '@blc-mono/redemptions/application/services/vaultBatch/VaultCodesUploadService';
import {
  RedemptionsVaultBatchEvents,
  UPLOAD_FILE_TYPE,
} from '@blc-mono/redemptions/infrastructure/eventBridge/events/vaultBatch';
import { createTestLogger } from '@blc-mono/redemptions/libs/test/helpers/logger';

import { VaultCodesUploadController } from './VaultCodesUploadController';

describe('VaultCodesUploadController', () => {
  describe('invoke', () => {
    it('should call the VaultCodesUploadService correctly', async () => {
      const testLogger = createTestLogger();
      const service = {
        handle: jest.fn(),
      } satisfies Partial<IVaultCodesUploadService>;
      const controller = new VaultCodesUploadController(testLogger, as(service));
      const mockEvent = {
        source: RedemptionsVaultBatchEvents.UPLOAD_SOURCE,
        'detail-type': RedemptionsVaultBatchEvents.UPLOAD_DETAIL_TYPE,
        account: faker.string.numeric(),
        id: faker.string.uuid(),
        time: faker.date.recent().toISOString(),
        region: faker.helpers.arrayElement(['eu-west-2', 'ap-southeast-2']),
        resources: [],
        version: faker.string.numeric(),
        detail: {
          bucket: {
            name: faker.system.commonFileName(),
          },
          object: {
            key: `vlt-${faker.string.uuid()}/vbt-${faker.string.uuid()}/2024-07-30T13:29:51.740Z${UPLOAD_FILE_TYPE}`,
          },
        },
      } satisfies UnknownEventBridgeEvent;

      await controller.invoke(mockEvent);

      expect(service.handle).toHaveBeenCalledTimes(1);
    });
  });
});
