import { faker } from '@faker-js/faker';

import {
  IUpdateRedemptionConfigService,
  UpdateGenericRedemptionSchema,
  UpdatePreAppliedRedemptionSchema,
  UpdateRedemptionConfigError,
  UpdateRedemptionConfigSuccess,
  UpdateShowCardRedemptionSchema,
} from '@blc-mono/redemptions/application/services/redemptionConfig/UpdateRedemptionConfigService';
import { RedemptionConfig } from '@blc-mono/redemptions/application/transformers/RedemptionConfigTransformer';

import { createTestLogger } from '../../../../libs/test/helpers/logger';

import { UpdateRedemptionConfigController } from './UpdateRedemptionConfigController';

describe('UpdateRedemptionConfigController', () => {
  const testGenericBody = {
    id: `rdm-${faker.string.uuid()}`,
    offerId: faker.number.int({ max: 1000000 }),
    redemptionType: 'generic',
    connection: 'affiliate',
    companyId: faker.number.int({ max: 1000000 }),
    affiliate: 'awin',
    url: 'https://www.awin1.com/',
    generic: {
      id: `gnr-${faker.string.uuid()}`,
      code: 'DISCOUNT_CODE_01',
    },
  } satisfies UpdateGenericRedemptionSchema;

  const testGenericRedemptionConfig: RedemptionConfig = {
    ...testGenericBody,
    offerId: String(testGenericBody.offerId),
    companyId: String(testGenericBody.companyId),
  };

  const testPreAppliedBody = {
    id: `rdm-${faker.string.uuid()}`,
    offerId: faker.number.int({ max: 1000000 }),
    redemptionType: 'preApplied',
    connection: 'direct',
    companyId: faker.number.int({ max: 1000000 }),
    affiliate: null,
    url: 'https://www.whatever.com/',
  } satisfies UpdatePreAppliedRedemptionSchema;

  const testPreAppliedRedemptionConfig: RedemptionConfig = {
    ...testPreAppliedBody,
    offerId: String(testGenericBody.offerId),
    companyId: String(testGenericBody.companyId),
  };

  const testShowCardBody = {
    id: `rdm-${faker.string.uuid()}`,
    offerId: faker.number.int({ max: 1000000 }),
    redemptionType: 'showCard',
    connection: 'none',
    companyId: faker.number.int({ max: 1000000 }),
    affiliate: null,
  } satisfies UpdateShowCardRedemptionSchema;

  const testShowCardRedemptionConfig: RedemptionConfig = {
    ...testShowCardBody,
    offerId: String(testGenericBody.offerId),
    companyId: String(testGenericBody.companyId),
  };

  function getTestUpdateRedemptionConfigError(
    kind: 'Error' | 'RedemptionNotFound' | 'GenericNotFound',
  ): UpdateRedemptionConfigError {
    return {
      kind: kind,
      data: {
        message: faker.string.alpha({
          length: 10,
        }),
      },
    };
  }

  function getTestUpdateRedemptionConfigSuccess(data: RedemptionConfig): UpdateRedemptionConfigSuccess {
    return {
      kind: 'Ok',
      data: data,
    };
  }

  const logger = createTestLogger();

  const UpdateRedemptionConfigService = {
    updateRedemptionConfig: jest.fn(),
  } satisfies IUpdateRedemptionConfigService;

  /**
   * generic redemptionType tests
   */
  it('Maps "Error" result for generic redemption correctly to 500 response', async () => {
    UpdateRedemptionConfigService.updateRedemptionConfig.mockResolvedValue(getTestUpdateRedemptionConfigError('Error'));
    const controller = new UpdateRedemptionConfigController(logger, UpdateRedemptionConfigService);
    const actual = await controller.handle({ body: testGenericBody });
    expect(actual.statusCode).toEqual(500);
  });

  it('Maps "RedemptionNotFound" result for generic redemption correctly to 404 response', async () => {
    UpdateRedemptionConfigService.updateRedemptionConfig.mockResolvedValue(
      getTestUpdateRedemptionConfigError('RedemptionNotFound'),
    );
    const controller = new UpdateRedemptionConfigController(logger, UpdateRedemptionConfigService);
    const actual = await controller.handle({ body: testGenericBody });
    expect(actual.statusCode).toEqual(404);
  });

  it('Maps "GenericNotFound" result for generic redemption correctly to 404 response', async () => {
    UpdateRedemptionConfigService.updateRedemptionConfig.mockResolvedValue(
      getTestUpdateRedemptionConfigError('GenericNotFound'),
    );
    const controller = new UpdateRedemptionConfigController(logger, UpdateRedemptionConfigService);
    const actual = await controller.handle({ body: testGenericBody });
    expect(actual.statusCode).toEqual(404);
  });

  it('Maps "Ok" result for generic redemption correctly correctly to 200 response', async () => {
    UpdateRedemptionConfigService.updateRedemptionConfig.mockResolvedValue(
      getTestUpdateRedemptionConfigSuccess(testGenericRedemptionConfig),
    );
    const controller = new UpdateRedemptionConfigController(logger, UpdateRedemptionConfigService);
    const actual = await controller.handle({ body: testGenericBody });
    expect(actual.statusCode).toEqual(200);
  });

  /**
   * preApplied redemptionType tests
   */
  it('Maps "Error" result for preApplied redemption correctly to 500 response', async () => {
    UpdateRedemptionConfigService.updateRedemptionConfig.mockResolvedValue(getTestUpdateRedemptionConfigError('Error'));
    const controller = new UpdateRedemptionConfigController(logger, UpdateRedemptionConfigService);
    const actual = await controller.handle({ body: testPreAppliedBody });
    expect(actual.statusCode).toEqual(500);
  });

  it('Maps "RedemptionNotFound" result for preApplied redemption correctly to 404 response', async () => {
    UpdateRedemptionConfigService.updateRedemptionConfig.mockResolvedValue(
      getTestUpdateRedemptionConfigError('RedemptionNotFound'),
    );
    const controller = new UpdateRedemptionConfigController(logger, UpdateRedemptionConfigService);
    const actual = await controller.handle({ body: testPreAppliedBody });
    expect(actual.statusCode).toEqual(404);
  });

  it('Maps "Ok" result for preApplied redemption correctly correctly to 200 response', async () => {
    UpdateRedemptionConfigService.updateRedemptionConfig.mockResolvedValue(
      getTestUpdateRedemptionConfigSuccess(testPreAppliedRedemptionConfig),
    );
    const controller = new UpdateRedemptionConfigController(logger, UpdateRedemptionConfigService);
    const actual = await controller.handle({ body: testPreAppliedBody });
    expect(actual.statusCode).toEqual(200);
  });

  /**
   * showCard redemptionType tests
   */
  it('Maps "Error" result for showCard redemption correctly to 500 response', async () => {
    UpdateRedemptionConfigService.updateRedemptionConfig.mockResolvedValue(getTestUpdateRedemptionConfigError('Error'));
    const controller = new UpdateRedemptionConfigController(logger, UpdateRedemptionConfigService);
    const actual = await controller.handle({ body: testShowCardBody });
    expect(actual.statusCode).toEqual(500);
  });

  it('Maps "RedemptionNotFound" result for showCard redemption correctly to 404 response', async () => {
    UpdateRedemptionConfigService.updateRedemptionConfig.mockResolvedValue(
      getTestUpdateRedemptionConfigError('RedemptionNotFound'),
    );
    const controller = new UpdateRedemptionConfigController(logger, UpdateRedemptionConfigService);
    const actual = await controller.handle({ body: testShowCardBody });
    expect(actual.statusCode).toEqual(404);
  });

  it('Maps "Ok" result for showCard redemption correctly correctly to 200 response', async () => {
    UpdateRedemptionConfigService.updateRedemptionConfig.mockResolvedValue(
      getTestUpdateRedemptionConfigSuccess(testShowCardRedemptionConfig),
    );
    const controller = new UpdateRedemptionConfigController(logger, UpdateRedemptionConfigService);
    const actual = await controller.handle({ body: testShowCardBody });
    expect(actual.statusCode).toEqual(200);
  });
});
