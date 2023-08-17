import { Stack } from 'aws-cdk-lib';
import { Bucket } from 'sst/constructs';

export class Buckets {
  blcUKBucket: Bucket;
  blcAUSBucket: Bucket;
  ddsUKBucket: Bucket;

  constructor(private stack: Stack, private stage: string) {
    this.blcUKBucket = this.createBlcUKBucket();
    this.blcAUSBucket = this.createBlcAUSBucket();
    this.ddsUKBucket = this.createDdsUKBucket();
  }

  private createBlcUKBucket(): Bucket {
    return new Bucket(this.stack, 'blcUKBucket', {
      name: `${this.stage}-menus-blc-uk-bucket`,
    });
  }

  private createBlcAUSBucket(): Bucket {
    return new Bucket(this.stack, 'blcAUSBucket', {
      name: `${this.stage}-menus-blc-aus-bucket`,
    });
  }

  private createDdsUKBucket(): Bucket {
    return new Bucket(this.stack, 'ddsUKBucket', {
      name: `${this.stage}-menus-dds-uk-bucket`,
    });
  }
}
