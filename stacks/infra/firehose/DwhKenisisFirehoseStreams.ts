import { RemovalPolicy } from 'aws-cdk-lib';
import * as kinesisfirehose from 'aws-cdk-lib/aws-kinesisfirehose';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as logs from 'aws-cdk-lib/aws-logs';
import { Stack } from "sst/constructs";
import { IFirehoseStreamAdapter } from './adapter';
import { isProduction } from '@blc-mono/core/src/utils/checkEnvironment';
import { Config } from 'sst/constructs';

/**
 * Mocks of the production data-warehouse kenisis firehose streams.
 */
export class DwhKenisisFirehoseStreams {
  public readonly compViewStream: IFirehoseStreamAdapter;
  public readonly compClickStream: IFirehoseStreamAdapter;
  public readonly compAppViewStream: IFirehoseStreamAdapter;
  public readonly compAppClickStream: IFirehoseStreamAdapter;
  public readonly vaultStream: IFirehoseStreamAdapter;
  public readonly redemptionTypeStream: IFirehoseStreamAdapter;

  constructor(stack: Stack) {
    this.compViewStream = new KenisisFirehoseStream(stack, 'dwh-blc-production-compView').setup();
    this.compClickStream = new KenisisFirehoseStream(stack, 'dwh-blc-production-compClick').setup();
    this.compAppViewStream = new KenisisFirehoseStream(stack, 'dwh-blc-production-compAppView').setup();
    this.compAppClickStream = new KenisisFirehoseStream(stack, 'dwh-blc-production-compAppClick').setup();
    this.vaultStream = new KenisisFirehoseStream(stack, 'dwh-blc-production-vault').setup();
    this.redemptionTypeStream = new KenisisFirehoseStream(stack, 'dwh-blc-production-redemption').setup();
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
    const regionPrefix = this.stack.region === 'eu-west-2' ? '' : `au-`;
    const bucketName = `${regionPrefix}${this.stack.stage}-${this.streamName}-destination`.toLowerCase().substring(0, 63);
    new Config.Parameter(
      this.stack,
      `${this.streamName.toUpperCase().replaceAll('-', '_')}_DESTINATION_BUCKET`,
      {
        value: bucketName,
      }
    );
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
