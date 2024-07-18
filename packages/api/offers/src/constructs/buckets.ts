import { Stack } from 'aws-cdk-lib';
import { Bucket } from 'sst/constructs';
import { BlockPublicAccess, EventType } from "aws-cdk-lib/aws-s3";
import { SqsDestination } from "aws-cdk-lib/aws-s3-notifications";
import { Queues } from "./queues";

export class Buckets {
  menusBucket: Bucket;

  constructor(private stack: Stack, private stage: string, private queues: Queues) {
    this.menusBucket = this.createMenusBucket();
    this.initialiseNotification();
  }

  private initialiseNotification(): void {
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

  private addNotification(bucket: Bucket): void {
    bucket.cdk.bucket.addEventNotification(
      EventType.OBJECT_CREATED,
      new SqsDestination(this.queues.s3MenusBucketEventQueue.cdk.queue)
    );
  }
}
