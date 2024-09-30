import { faker } from '@faker-js/faker';

import { as } from '@blc-mono/core/utils/testing';
import { PatchRedemptionModelRequestBody } from '@blc-mono/redemptions/application/controllers/adminApiGateway/redemptionConfig/UpdateRedemptionConfigController';
import { RedemptionType } from '@blc-mono/redemptions/libs/database/schema';
import { redemptionConfigEntityFactory } from '@blc-mono/redemptions/libs/test/factories/redemptionConfigEntity.factory';
import { createSilentLogger } from '@blc-mono/redemptions/libs/test/helpers/logger';

import { IRedemptionConfigRepository } from '../../repositories/RedemptionConfigRepository';
import { RedemptionConfigTransformer } from '../../transformers/RedemptionConfigTransformer';

import {
  IUpdateRedemptionConfigService,
  UpdateRedemptionConfigResult,
  UpdateRedemptionConfigService,
} from './UpdateRedemptionConfigService';

jest.mock('@blc-mono/core/utils/logger/logger');

describe('UpdateRedemptionConfigService', () => {
  let service: IUpdateRedemptionConfigService;

  describe.each([['showCard'], ['preApplied']])('Update %s redemption', (redemptionType: string) => {
    const testRedemption = redemptionConfigEntityFactory.build({
      redemptionType: redemptionType as RedemptionType,
    });
    const requestData = {
      ...testRedemption,
      url: redemptionType === 'preApplied' ? faker.internet.url() : null,
      generics: null,
      vault: null,
    };
    const mockConfigTransformer: Partial<RedemptionConfigTransformer> = {
      transformToRedemptionConfig: jest.fn().mockReturnValue(requestData),
    };

    it('should return kind RedemptionNotFound if no redemption is found', async () => {
      const mockTestLogger = createSilentLogger();
      const mockRedemptionsRepository: Partial<IRedemptionConfigRepository> = {
        findOneById: jest.fn().mockResolvedValue(undefined),
        updateOneById: jest.fn().mockResolvedValue(null),
      };
      service = new UpdateRedemptionConfigService(
        mockTestLogger,
        as(mockRedemptionsRepository),
        as(mockConfigTransformer),
      );
      const expectedResult: UpdateRedemptionConfigResult = {
        kind: 'RedemptionNotFound',
      };

      const result = await service.updateRedemptionConfig(requestData as PatchRedemptionModelRequestBody);
      expect(result).toEqual(expectedResult);
      expect(mockTestLogger.error).toHaveBeenCalledWith({
        message: 'Update Redemption Config - Redemption not found for given ID',
        context: {
          data: requestData,
        },
      });
    });
    it('should return kind Error if no redemption is updated', async () => {
      const mockTestLogger = createSilentLogger();
      const mockRedemptionsRepository: Partial<IRedemptionConfigRepository> = {
        findOneById: jest.fn().mockResolvedValue(requestData),
        updateOneById: jest.fn().mockResolvedValue(null),
      };
      service = new UpdateRedemptionConfigService(
        mockTestLogger,
        as(mockRedemptionsRepository),
        as(mockConfigTransformer),
      );
      const expectedResult: UpdateRedemptionConfigResult = {
        kind: 'Error',
      };

      const result = await service.updateRedemptionConfig(requestData as PatchRedemptionModelRequestBody);
      expect(result).toEqual(expectedResult);
      expect(mockTestLogger.error).toHaveBeenCalledWith({
        message: 'Update Redemption Config - Redemption not updated',
        context: {
          data: requestData,
        },
      });
    });
    it('should return kind Error if an error is throw', async () => {
      const mockTestLogger = createSilentLogger();
      const mockRedemptionsRepository: Partial<IRedemptionConfigRepository> = {
        findOneById: jest.fn().mockResolvedValue(requestData),
        updateOneById: jest.fn().mockRejectedValue(new Error('error')),
      };
      service = new UpdateRedemptionConfigService(
        mockTestLogger,
        as(mockRedemptionsRepository),
        as(mockConfigTransformer),
      );
      const expectedResult: UpdateRedemptionConfigResult = {
        kind: 'Error',
      };

      const result = await service.updateRedemptionConfig(requestData as PatchRedemptionModelRequestBody);
      expect(result).toEqual(expectedResult);
      expect(mockTestLogger.error).toHaveBeenCalledWith({
        message: 'Update Redemption Config - Error updating redemption',
        context: {
          data: requestData,
          error: new Error('error'),
        },
      });
    });
    it('should return kind Ok if redemption is updated successfully', async () => {
      const mockTestLogger = createSilentLogger();
      const mockRedemptionsRepository: Partial<IRedemptionConfigRepository> = {
        findOneById: jest.fn().mockResolvedValue(requestData),
        updateOneById: jest.fn().mockResolvedValue(requestData),
      };
      service = new UpdateRedemptionConfigService(
        mockTestLogger,
        as(mockRedemptionsRepository),
        as(mockConfigTransformer),
      );
      const expectedResult: UpdateRedemptionConfigResult = {
        kind: 'Ok',
        data: {
          ...requestData,
          companyId: requestData.companyId as unknown as string,
          offerId: requestData.offerId as unknown as string,
        },
      };

      const result = await service.updateRedemptionConfig(requestData as PatchRedemptionModelRequestBody);
      expect(result).toEqual(expectedResult);
      expect(mockTestLogger.info).toHaveBeenCalledWith({
        message: 'Update Redemption Config - Updating redemption',
        context: {
          data: requestData,
        },
      });
    });
  });
});
