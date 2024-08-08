import { RemovalPolicy } from 'aws-cdk-lib';
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { Stack } from 'sst/constructs';

import { IVaultCodesUploadAdapter } from './adapter';

export class VaultCodesUpload {
  public readonly setUp: IVaultCodesUploadAdapter;

  constructor(private readonly stack: Stack) {
    this.setUp = this.setup();
  }

  public setup(): IVaultCodesUploadAdapter {
    const bucket = this.createBucket();
    return this.createAdapter(bucket);
  }

  private createBucket(): Bucket {
    //this comment can be removed, it is here just to trigger release PR, and again
    const bucketName = `${this.stack.stage}-${this.stack.region}-vault-codes-upload`;
    return new Bucket(this.stack, bucketName, {
      removalPolicy: RemovalPolicy.RETAIN_ON_UPDATE_OR_DELETE,
      autoDeleteObjects: false,
      bucketName,
      eventBridgeEnabled: true,
    });
  }

  private createAdapter(bucket: Bucket): IVaultCodesUploadAdapter {
    return {
      getBucketName: () => {
        return bucket.bucketName;
      },
      getGetRecordPolicyStatement: () => {
        return new PolicyStatement({
          actions: [
            'logs:PutLogEvents',
            'logs:CreateLogGroup',
            'logs:CreateLogStream',
            's3:GetObject',
            's3:ListBucket',
          ],
          effect: Effect.ALLOW,
          resources: ['arn:aws:logs:*:*:*', bucket.bucketArn, `${bucket.bucketArn}/*`],
        });
      },
    };
  }
}
