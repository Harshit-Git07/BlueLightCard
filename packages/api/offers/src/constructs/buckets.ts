import { Stack } from 'aws-cdk-lib';
import { Bucket } from 'sst/constructs';
import { BlockPublicAccess, EventType } from "aws-cdk-lib/aws-s3";
import { SqsDestination } from "aws-cdk-lib/aws-s3-notifications";
import { Queues } from "./queues";

export class Buckets {
  menusBucket: Bucket;
  blcUKBucket: Bucket;
  blcAUSBucket: Bucket;
  ddsUKBucket: Bucket;

  constructor(private stack: Stack, private stage: string, private queues: Queues) {
    this.menusBucket = this.createMenusBucket();
    this.blcUKBucket = this.createBlcUKBucket();
    this.blcAUSBucket = this.createBlcAUSBucket();
    this.ddsUKBucket = this.createDdsUKBucket();
    this.initialiseNotification();
  }

  private initialiseNotification(): void {
    this.addNotification(this.blcUKBucket);
    this.addNotification(this.blcAUSBucket);
    this.addNotification(this.ddsUKBucket);
    this.addNotification(this.menusBucket);
  }

  private createMenusBucket(): Bucket {
    return new Bucket(this.stack, 'menusBucket', {
      name: `menus-${this.stage}-${this.stack.region}-${this.stack.account}`,
      cdk: {
        bucket: {
          blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
        },
      },
    });
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

  private addNotification(bucket: Bucket): void {
    bucket.cdk.bucket.addEventNotification(
      EventType.OBJECT_CREATED,
      new SqsDestination(this.queues.s3MenusBucketEventQueue.cdk.queue)
    );
  }
}
