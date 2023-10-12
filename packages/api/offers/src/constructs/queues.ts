import { Queue } from "sst/constructs";
import { Stack } from "aws-cdk-lib";

export class Queues {
  s3MenusBucketEventQueue: Queue;

  constructor (private stack: Stack) {
    this.s3MenusBucketEventQueue = this.createS3MenusBucketEventQueue();
  }

  private createS3MenusBucketEventQueue (): Queue {
    return new Queue(this.stack, 's3MenusBucketEventQueue');
  }
}