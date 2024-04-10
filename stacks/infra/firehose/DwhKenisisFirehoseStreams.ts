import { RemovalPolicy } from 'aws-cdk-lib';
import * as kinesisfirehose from 'aws-cdk-lib/aws-kinesisfirehose';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as logs from 'aws-cdk-lib/aws-logs';
import { Stack } from "sst/constructs";
import { IFirehoseStreamAdapter } from './adapter';
import { isProduction } from '@blc-mono/core/src/utils/checkEnvironment';

/**
 * Mocks of the production data-warehouse kenisis firehose streams.
 */
export class DwhKenisisFirehoseStreams {
  public readonly compViewStream: IFirehoseStreamAdapter;
  public readonly compClickStream: IFirehoseStreamAdapter;
  public readonly compVaultClickStream: IFirehoseStreamAdapter;

  constructor(stack: Stack) {
    this.compViewStream = new KenisisFirehoseStream(stack, 'dwh-blc-production-compView').setup();
    this.compClickStream = new KenisisFirehoseStream(stack, 'dwh-blc-production-compClick').setup();
    this.compVaultClickStream = new KenisisFirehoseStream(stack, 'dwh-blc-production-compVaultClick').setup();
  }
}

class KenisisFirehoseStream {
  constructor(
    private readonly stack: Stack,
    private readonly streamName: string,
  ) {}

  public setup(): IFirehoseStreamAdapter {
    if (isProduction(this.stack.stage)) {
      return this.setupProd();
    }
    return this.setupDev();
  }

  private setupProd(): IFirehoseStreamAdapter {
    const streamArn = `arn:aws:firehose:${this.stack.region}:${this.stack.account}:deliverystream/${this.streamName}`;
    return {
      getStreamName: () => {
        return this.streamName;
      },
      getPutRecordPolicyStatement: () => {
        return new iam.PolicyStatement({
          actions: ['firehose:PutRecord'],
          effect: iam.Effect.ALLOW,
          resources: [streamArn],
        });
      },
    }
  }

  private setupDev(): IFirehoseStreamAdapter {
    const destinationBucket = this.createDestinationBucket();
    const deliveryRole = this.createDeliveryRole();
    const deliveryStream = this.createDeliveryStream(
      destinationBucket,
      deliveryRole,
    );
    return this.createAdapter(deliveryStream);
  }

  private createDestinationBucket(): s3.Bucket {
    const bucketName = `${this.stack.stage}-${this.streamName}-destination`.toLowerCase().substring(0, 63);
    return new s3.Bucket(this.stack, bucketName, {
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      bucketName,
    });
  }

  private createDeliveryRole(): iam.Role {
    return new iam.Role(this.stack, `${this.stack.stage}-${this.streamName}-delivery-role`, {
      assumedBy: new iam.ServicePrincipal('firehose.amazonaws.com'),
    });
  }

  private createDeliveryStream(
    destination: s3.Bucket,
    role: iam.Role,
  ): kinesisfirehose.CfnDeliveryStream {
    const streamName = `${this.stack.stage}-${this.streamName}`;
    const logGroupName = `${streamName}-log-group`;
    const logGroup = new logs.LogGroup(this.stack, logGroupName, {
      removalPolicy: RemovalPolicy.DESTROY,
      retention: logs.RetentionDays.ONE_WEEK,
    });
    const logStream = new logs.LogStream(this.stack, `${streamName}-log-stream`, {
      logGroup,
      removalPolicy: RemovalPolicy.DESTROY,
    });
    const stream = new kinesisfirehose.CfnDeliveryStream(this.stack, streamName, {
      deliveryStreamName: streamName,
      deliveryStreamType: 'DirectPut',
      s3DestinationConfiguration: {
        bucketArn: destination.bucketArn,
        roleArn: role.roleArn,
        bufferingHints: {
          intervalInSeconds: 0,
          sizeInMBs: 1,
        },
        cloudWatchLoggingOptions: {
          enabled: true,
          logGroupName: logGroup.logGroupName,
          logStreamName: logStream.logStreamName
        },
      },
    });
    destination.grantReadWrite(role);
    return stream;
  }

  private createAdapter(deliveryStream: kinesisfirehose.CfnDeliveryStream): IFirehoseStreamAdapter {
    return {
      getStreamName: () => {
        return deliveryStream.deliveryStreamName!;
      },
      getPutRecordPolicyStatement: () => {
        return new iam.PolicyStatement({
          actions: ['firehose:PutRecord'],
          effect: iam.Effect.ALLOW,
          resources: [deliveryStream.attrArn],
        });
      },
    }
  }
}
