import { S3Client } from '@aws-sdk/client-s3';

import { getEnv } from '@blc-mono/core/utils/getEnv';

export interface IS3ClientProvider {
  getClient: () => S3Client;
}

export class S3ClientProvider implements IS3ClientProvider {
  static readonly key = 'S3ClientProvider' as const;
  static readonly inject = [] as const;

  private awsRegion = getEnv('AWS_REGION');

  public getClient(): S3Client {
    return new S3Client({ region: this.awsRegion });
  }
}
