import { Construct } from 'constructs';
import { App, Bucket, Stack, Config } from 'sst/constructs';
import { RemovalPolicy } from 'aws-cdk-lib';
import { isDdsUkBrand } from '@blc-mono/core/utils/checkBrand';
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';
import { SSTConstruct } from 'sst/constructs/Construct';

export class EmailBucket extends Construct {
  readonly bindings: SSTConstruct[] = [];

  constructor(app: App, stack: Stack) {
    super(stack, 'EmailBucket');

    const brandDeployingFor = this.getCurrentBrand(app);

    const bucket = new Bucket(stack, `${brandDeployingFor}-emailTemplatesBucket`, {
      cdk: {
        bucket: {
          removalPolicy: RemovalPolicy.RETAIN,
          autoDeleteObjects: false,
        },
      },
    });

    const bucketNameParameterStoreValue = new Config.Parameter(
      stack,
      'email-templates-bucket-name',
      {
        value: bucket.bucketName,
      },
    );

    new BucketDeployment(stack, 'DeployFiles', {
      sources: [
        Source.asset(
          `./packages/api/members/application/services/email/templates/emailTemplates/${brandDeployingFor}/service/`,
        ),
      ],
      destinationBucket: bucket.cdk.bucket,
    });

    this.bindings.push(bucket);
    this.bindings.push(bucketNameParameterStoreValue);
  }

  private getCurrentBrand(app: App): 'dds' | 'blcau' | 'blcuk' {
    if (isDdsUkBrand()) return 'dds';

    return app.region === 'ap-south-east-2' ? 'blcau' : 'blcuk';
  }
}
