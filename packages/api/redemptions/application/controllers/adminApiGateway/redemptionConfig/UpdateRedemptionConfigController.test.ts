import {
  IUpdateRedemptionConfigService,
  UpdateRedemptionConfigResult,
} from '@blc-mono/redemptions/application/services/redemptionConfig/UpdateRedemptionConfigService';
import { RedemptionType } from '@blc-mono/redemptions/libs/database/schema';
import { redemptionConfigEntityFactory } from '@blc-mono/redemptions/libs/test/factories/redemptionConfigEntity.factory';
import { createTestLogger } from '@blc-mono/redemptions/libs/test/helpers/logger';

import { PatchRedemptionModelRequest, UpdateRedemptionConfigController } from './UpdateRedemptionConfigController';

describe('RedemptionUpdateController', () => {
  const mockTestLogger = createTestLogger();
  const updateRedemptionConfigService = {
    updateRedemptionConfig: jest.fn(),
  } satisfies IUpdateRedemptionConfigService;
  const controller = new UpdateRedemptionConfigController(mockTestLogger, updateRedemptionConfigService);

  describe.each([['showCard'], ['preApplied']])('Update %s redemption', (redemptionType: string) => {
    const testRedemption = redemptionConfigEntityFactory.build({
      redemptionType: redemptionType as RedemptionType,
    });
    const requestData = {
      body: testRedemption,
    };
    it('should return kind RedemptionNotFound if no redemption is found', async () => {
      // Arrange
      updateRedemptionConfigService.updateRedemptionConfig.mockResolvedValue({
        kind: 'RedemptionNotFound',
      } satisfies UpdateRedemptionConfigResult);

      // Act
      const result = await controller.handle(requestData as PatchRedemptionModelRequest);

      // Assert
      expect(result).toEqual({
        statusCode: 404,
        data: {
          message: 'Redemption not found with given ID',
        },
      });
    });

    it('should return kind Error if no redemption is updated', async () => {
      // Arrange
      updateRedemptionConfigService.updateRedemptionConfig.mockResolvedValue({
        kind: 'Error',
      } satisfies UpdateRedemptionConfigResult);

      // Act
      const result = await controller.handle(requestData as PatchRedemptionModelRequest);

      // Assert
      expect(result.statusCode).toEqual(500);
      expect(result.data).toEqual({
        message: 'Internal Server Error',
      });
    });

    it('should return kind Ok if redemption is updated', async () => {
      // Arrange
      const expectedBody = {
        ...testRedemption,
        companyId: String(testRedemption.companyId),
        offerId: String(testRedemption.offerId),
      };
      updateRedemptionConfigService.updateRedemptionConfig.mockResolvedValue({
        kind: 'Ok',
        data: expectedBody,
      } satisfies UpdateRedemptionConfigResult);

      // Act
      const result = await controller.handle(requestData as PatchRedemptionModelRequest);

      // Assert
      expect(result.statusCode).toEqual(200);
      expect(result.data).toEqual(expectedBody);
    });
  });
});
