import { S3Client } from '@aws-sdk/client-s3';

import { S3ClientProvider } from './S3ClientProvider';

const setup = () => {
  process.env.AWS_REGION = 'eu-west-2';
};

const teardown = () => {
  delete process.env.AWS_REGION;
};

describe('S3ClientProvider', () => {
  beforeEach(() => {
    setup();
  });

  afterAll(() => {
    teardown();
  });

  it('should initialise correctly', () => {
    const S3 = new S3ClientProvider().getClient();
    expect(S3).toBeDefined();
    expect(S3).toBeInstanceOf(S3Client);
  });
});
