import { Stack } from 'aws-cdk-lib';
import { Bucket } from 'sst/constructs';
import { BlockPublicAccess } from 'aws-cdk-lib/aws-s3';

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
      cdk: {
        bucket: {
          blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
        },
      },
    });
  }

  private createBlcAUSBucket(): Bucket {
    return new Bucket(this.stack, 'blcAUSBucket', {
      name: `${this.stage}-menus-blc-aus-bucket`,
      cdk: {
        bucket: {
          blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
        },
      },
    });
  }

  private createDdsUKBucket(): Bucket {
    return new Bucket(this.stack, 'ddsUKBucket', {
      name: `${this.stage}-menus-dds-uk-bucket`,
      cdk: {
        bucket: {
          blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
        },
      },
    });
  }
}
