import { Stack } from 'aws-cdk-lib';
import { Bucket } from 'sst/constructs';
import { BlockPublicAccess } from "aws-cdk-lib/aws-s3";

export class Buckets {
  ecFormOutputBucket: Bucket;

  constructor(private stack: Stack, private stage: string) {
    this.ecFormOutputBucket = this.createEcFormOutputBucket();
  }

  private createEcFormOutputBucket(): Bucket {
    return new Bucket(this.stack, 'ecFormOutputBucket', {
      name: `${this.stage}-ec-form-output-data-bucket`,
      cdk: {
        bucket: {
          blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
        },
      },
    });
  }
}
