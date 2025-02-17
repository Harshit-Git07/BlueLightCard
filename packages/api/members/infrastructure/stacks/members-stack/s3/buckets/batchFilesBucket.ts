import { Construct } from 'constructs';
import { RemovalPolicy } from 'aws-cdk-lib';
import { Bucket, Stack } from 'sst/constructs';

export class BatchFilesBucket extends Construct {
  readonly bucket: Bucket;

  constructor(stack: Stack) {
    super(stack, 'BatchFilesBucket');

    this.bucket = new Bucket(stack, 'batchFilesBucket', {
      cdk: {
        bucket: {
          removalPolicy: RemovalPolicy.RETAIN,
          autoDeleteObjects: false,
        },
      },
    });
  }
}
