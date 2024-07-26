import { SES } from '@aws-sdk/client-ses';

import { SesClientProvider } from './SesClientProvider';

const setup = () => {
  process.env.AWS_REGION = 'eu-west-2';
};

const teardown = () => {
  delete process.env.AWS_REGION;
};

describe('SesClientProvider', () => {
  beforeEach(() => {
    setup();
  });

  afterAll(() => {
    teardown();
  });

  it('should initialise correctly', () => {
    const SESEmail = new SesClientProvider().getClient();
    expect(SESEmail).toBeDefined();
    expect(SESEmail).toBeInstanceOf(SES);
  });
});
