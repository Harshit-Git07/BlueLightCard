import { as } from '@blc-mono/core/utils/testing';
import { CreateRedemptionConfigService } from '@blc-mono/redemptions/application/services/redemptionConfig/CreateRedemptionConfigService';
import { createTestLogger } from '@blc-mono/redemptions/libs/test/helpers/logger';

import { APIResponse, CreateRedemptionConfigController } from './CreateRedemptionConfigController';

describe('CreateRedemptionConfigController', () => {
  it('returns 200 for a stubbed successful request', async () => {
    const logger = createTestLogger();
    const service = new CreateRedemptionConfigService(logger);

    const controller = new CreateRedemptionConfigController(logger, service);
    const actual = await controller.handle({ body: {} });

    expect(actual.statusCode).toEqual(200);
    expect(actual.data).toContain('success');
  });

  it('returns 400 for a stubbed unsuccessful request', async () => {
    const logger = createTestLogger();
    const service = new CreateRedemptionConfigService(logger);

    const controller = new CreateRedemptionConfigController(logger, service);
    const actual = await controller.invoke(
      as({
        body: JSON.stringify({
          error: 'Broken',
          meta: { tracingId: 'yes' },
        }),
        requestContext: {},
      }),
    );

    const parsedBody = JSON.parse(as(actual.body)) as APIResponse;
    expect(actual.statusCode).toEqual(400);
    expect(parsedBody.data).toContain('error');
  });
});
