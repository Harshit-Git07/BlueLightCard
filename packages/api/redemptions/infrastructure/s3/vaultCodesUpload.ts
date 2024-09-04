import { RemovalPolicy } from 'aws-cdk-lib';
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { Stack } from 'sst/constructs';

import { MAP_BRAND } from '@blc-mono/core/constants/common';
import { getBrandFromEnv } from '@blc-mono/core/utils/checkBrand';

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
    //S3 bucket names must be lowercase and not contain underscores
    const bucketBrand = MAP_BRAND[getBrandFromEnv()];

    //this comment can be removed, it is here just to trigger release PR, and again
    const bucketName = `${this.stack.stage}-${bucketBrand}-vault-codes-upload`;
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
      getGetObjectPolicyStatement: () => {
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
      getPutObjectPolicyStatement: () => {
        return new PolicyStatement({
          actions: ['s3:PutObject'],
          effect: Effect.ALLOW,
          resources: [bucket.bucketArn, `${bucket.bucketArn}/*`],
        });
      },
    };
  }
}
