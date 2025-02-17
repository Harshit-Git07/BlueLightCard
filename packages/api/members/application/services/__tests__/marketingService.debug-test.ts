/**
 * This is a debug test. It will not run as part of the test suite and is instead just used to test code against a real environment
 */
import { MarketingService } from '@blc-mono/members/application/services/marketingService';

const marketingService = new MarketingService();

it('should get marketing preferences', async () => {
  const preferences = await marketingService.getPreferences(
    '56c292e4-a031-7027-0ccf-8c8cc152eb2d',
    'web',
  );

  console.log({ preferences });
  expect(preferences).not.toBeUndefined();
});
