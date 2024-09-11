import { createTestLogger } from '@blc-mono/redemptions/libs/test/helpers/logger';

import { CreateRedemptionConfigService } from './CreateRedemptionConfigService';

describe('CreateRedemptionConfigService', () => {
  it("returns 'kind: OK' for stubbed successful request", async () => {
    const logger = createTestLogger();
    const service = new CreateRedemptionConfigService(logger);

    const result = await service.createRedemptionConfig({});

    expect(result.kind).toEqual('Ok');
    expect(result.data).toEqual(expect.any(Object));
  });

  it("returns 'kind: Error' for stubbed unsuccessful request", async () => {
    const logger = createTestLogger();
    const service = new CreateRedemptionConfigService(logger);

    const result = await service.createRedemptionConfig({ error: 'This does not work' });

    expect(result.kind).toEqual('Error');
    expect(result.data).toEqual(expect.any(Object));
  });
});
