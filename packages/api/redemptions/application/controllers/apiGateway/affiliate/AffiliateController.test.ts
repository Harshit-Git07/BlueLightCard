import { AffiliateController } from '@blc-mono/redemptions/application/controllers/apiGateway/affiliate/AffiliateController';
import {
  AffiliateHelper,
  AffiliateResultsKinds,
} from '@blc-mono/redemptions/application/helpers/affiliate/AffiliateHelper';
import { affiliateFactory } from '@blc-mono/redemptions/libs/test/factories/affilate.factory';
import { createSilentLogger, createTestLogger } from '@blc-mono/redemptions/libs/test/helpers/logger';

describe('AffiliateController', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should handle request with 200', () => {
    // Arrange
    const logger = createTestLogger();
    const controller = new AffiliateController(logger);
    const request = {
      headers: {
        Authorization: 'key',
      },
      body: affiliateFactory.build({
        affiliateUrl: 'https://www.awin1.com/?clickref=memberId',
        memberId: 'memberId',
      }),
    };
    // Act
    const result = controller.handle(request);
    expect(result.statusCode).toBe(200);
    expect(result.data).toEqual({
      message: 'Success',
      trackingUrl: `https://www.awin1.com/?clickref=memberId&clickref=memberId`,
    });
  });

  test('should handle request with 400', () => {
    // Arrange
    const logger = createSilentLogger();
    const controller = new AffiliateController(logger);
    const request = {
      headers: {
        Authorization: 'key',
      },
      body: affiliateFactory.build(),
    };
    // Act
    const result = controller.handle(request);
    expect(result.statusCode).toBe(400);
    expect(result.data).toEqual({ message: 'Error while creating tracking URL (affiliate not supported)' });
  });

  test('should handle request with 500', () => {
    // Arrange
    const logger = createSilentLogger();
    const controller = new AffiliateController(logger);
    const request = {
      headers: {
        Authorization: 'key',
      },
      body: affiliateFactory.build(),
    };

    jest.spyOn(AffiliateHelper, 'getTrackingUrl').mockReturnValue({
      kind: AffiliateResultsKinds.Error,
      data: {
        message: 'Error while creating tracking URL',
      },
    });
    // Act
    const result = controller.handle(request);
    expect(result.statusCode).toBe(500);
    expect(result.data).toEqual({ message: 'Error while creating tracking URL' });
  });
});
