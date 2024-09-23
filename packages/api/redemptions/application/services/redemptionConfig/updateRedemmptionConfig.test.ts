import { PatchRedemptionModelRequest } from '@blc-mono/redemptions/application/controllers/adminApiGateway/redemptionConfig/UpdateRedemptionConfigController';
import { createTestLogger } from '@blc-mono/redemptions/libs/test/helpers/logger';

import {
  IUpdateRedemptionConfigService,
  UpdateRedemptionConfigResult,
  UpdateRedemptionConfigService,
} from './UpdateRedemptionConfig';

jest.mock('@blc-mono/core/utils/logger/logger');

describe('UpdateRedemptionConfigService', () => {
  let service: IUpdateRedemptionConfigService;

  beforeEach(() => {
    const logger = createTestLogger();
    service = new UpdateRedemptionConfigService(logger);
  });

  it('should return Error kind for missing body in request', async () => {
    const expectedResult: UpdateRedemptionConfigResult = {
      kind: 'Error',
      data: {
        message: 'error',
      },
    };
    const result = await service.updateRedemptionConfig({});
    expect(result).toEqual(expectedResult);
  });

  it('should return Ok kind for present body in request', async () => {
    const request: PatchRedemptionModelRequest = {
      body: {
        id: 'a',
        offerId: 'a',
        connections: 'a',
        affiliate: 'test',
      },
    } as unknown as PatchRedemptionModelRequest;

    const expectedResult: UpdateRedemptionConfigResult = {
      kind: 'Ok',
      data: {
        message: 'success',
      },
    };

    const result = await service.updateRedemptionConfig(request);
    expect(result).toEqual(expectedResult);
  });
});
