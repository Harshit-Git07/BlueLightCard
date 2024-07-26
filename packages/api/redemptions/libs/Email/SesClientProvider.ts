import { SES } from '@aws-sdk/client-ses';

import { getEnv } from '@blc-mono/core/utils/getEnv';

export interface ISesClientProvider {
  getClient: () => SES;
}

export class SesClientProvider implements ISesClientProvider {
  static key = 'AmazonSES' as const;
  static inject = [] as const;

  private awsRegion = getEnv('AWS_REGION');

  public getClient(): SES {
    return new SES({ region: this.awsRegion });
  }
}
