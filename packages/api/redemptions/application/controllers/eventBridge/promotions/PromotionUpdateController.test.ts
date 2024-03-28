import {
  IPromotionUpdateService,
  PromotionUpdateResults,
} from '@blc-mono/redemptions/application/services/dataSync/Promotions/PromotionUpdateService';
import { promotionsUpdatedEventFactory } from '@blc-mono/redemptions/libs/test/factories/promotionsEvents.factory';

import { createTestLogger } from '../../../../libs/test/helpers/logger';

import { PromotionUpdateController } from './PromotionUpdateController';

describe('PromotionUpdateController', () => {
  it('should return successfully when the promotion is updated', async () => {
    // Arrange
    const logger = createTestLogger();
    const service = {
      handlePromotionUpdate: jest.fn().mockResolvedValue({
        kind: PromotionUpdateResults.PROMOTION_UPDATED_SUCCESS,
      }),
    } satisfies IPromotionUpdateService;
    const controller = new PromotionUpdateController(logger, service);

    // Act
    const result = await controller.handle(promotionsUpdatedEventFactory.build());

    // Assert
    expect(result).toBeUndefined();
  });

  it('should throw an error when no promotions are updated', async () => {
    // Arrange
    const logger = createTestLogger();
    const service = {
      handlePromotionUpdate: jest.fn().mockResolvedValue({
        kind: PromotionUpdateResults.NO_PROMOTIONS_UPDATED,
      }),
    } satisfies IPromotionUpdateService;
    const controller = new PromotionUpdateController(logger, service);

    // Act
    const result = controller.handle(promotionsUpdatedEventFactory.build());

    // Assert
    await expect(result).rejects.toThrow('No promotions updated');
  });
});
