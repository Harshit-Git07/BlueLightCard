import { Queue } from "sst/constructs";
import { Stack } from "aws-cdk-lib";

export class Queues {
  s3MenusBucketEventQueue: Queue;
  bannerDlq: Queue;
  companiesDlq: Queue;

  constructor (private stack: Stack) {
    this.s3MenusBucketEventQueue = this.createS3MenusBucketEventQueue();
    this.bannerDlq = this.createBannerDlq();
    this.companiesDlq = this.createCompaniesDlq();
  }

  private createS3MenusBucketEventQueue (): Queue {
    return new Queue(this.stack, 's3MenusBucketEventQueue');
  }

  private createBannerDlq (): Queue {
    return new Queue(this.stack, 'BannerDLQ');
  }

  private createCompaniesDlq (): Queue {
    return new Queue(this.stack, 'CompaniesDLQ');
  }
}
