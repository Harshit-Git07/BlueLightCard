import { RemovalPolicy } from 'aws-cdk-lib';
import { ISecret, Secret } from 'aws-cdk-lib/aws-secretsmanager';
import * as kinesisfirehose from 'aws-cdk-lib/aws-kinesisfirehose';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as logs from 'aws-cdk-lib/aws-logs';
import { IFirehoseStreamAdapter } from './adapter';
import { isProduction, isStaging } from '@blc-mono/core/src/utils/checkEnvironment';
import { Config, Stack } from 'sst/constructs';
import { getBrandFromEnv } from '@blc-mono/core/utils/checkBrand';
import { BLC_AU_BRAND, BLC_UK_BRAND, DDS_UK_BRAND, MAP_BRAND } from '@blc-mono/core/constants/common';

type S3Destination = kinesisfirehose.CfnDeliveryStream.S3DestinationConfigurationProperty;
type RedshiftDestination = kinesisfirehose.CfnDeliveryStream.RedshiftDestinationConfigurationProperty;

type DestinationConfiguration = S3Destination | RedshiftDestination;
type Writeable<T> = { -readonly [P in keyof T]-?: T[P] };

const UNMANAGED_STREAMS = [
  'dwh-compView',
  'dwh-compClick',
  'dwh-compAppView',
  'dwh-compAppClick',
  'dwh-vault',
];

// TODO: Normalise the stream names with brands [blc-uk, dds-uk, blc-au] and stages [staging, production]
const platformMap =  {
  [BLC_UK_BRAND] : 'blc',
  [DDS_UK_BRAND] : 'dds',
  [BLC_AU_BRAND] : 'blc-au',
} as const;

const callbackVaultRedemptionStreamNames = {
	'production': {
		[BLC_UK_BRAND]: 'dwh-blc-production-vaultRedemption',
		[BLC_AU_BRAND]: 'dwh-blc-p1-production-vaultRedemption',
		[DDS_UK_BRAND]: 'dwh-dds-p1-production-vaultRedemptions'
	},
	'staging': {
		[BLC_UK_BRAND]: 'dwh-blc-p1-develop-vaultRedemption',
		[BLC_AU_BRAND]: 'dwh-blc-p1-develop-vaultRedemption',
		[DDS_UK_BRAND]: 'dwh-dds-p1-develop-vaultRedemptions'
	}
}
 
let redshiftSecret: ISecret;
const getRedshiftSecret = (stack: Stack) => {
  if (!redshiftSecret) {
    const environmentPrefix = isProduction(stack.stage) ? 'production' : 'staging';
    const brandSuffix = MAP_BRAND[getBrandFromEnv()];
    const secretName = `${environmentPrefix}-redshift-cluster-details-${brandSuffix}`;

    redshiftSecret = Secret.fromSecretNameV2(stack, 'redshift-cluster-details', secretName);
  }

  return redshiftSecret;
}

/**
 * Production data-warehouse kenisis firehose streams.
 */
export class DwhKenisisFirehoseStreams {
  public readonly compViewStream: IFirehoseStreamAdapter;
  public readonly compClickStream: IFirehoseStreamAdapter;
  public readonly compAppViewStream: IFirehoseStreamAdapter;
  public readonly compAppClickStream: IFirehoseStreamAdapter;
  public readonly vaultStream: IFirehoseStreamAdapter;
  public readonly redemptionTypeStream: IFirehoseStreamAdapter;
	public readonly callbackVaultRedemptionStreamProd: IFirehoseStreamAdapter;
	public readonly callbackVaultRedemptionStreamDevelop: IFirehoseStreamAdapter;

  constructor(stack: Stack) {
    // Creates Firehose stream references. Mocked in Production environments if present within `UNMANAGED_STREAMS` list.
    const secret = getRedshiftSecret(stack);

    if (!secret) {
      throw new Error('Redshift secret not found');
    }

    const redshiftSchemaName = secret.secretValueFromJson('schema');
		const brandFromEnv = getBrandFromEnv()
    const brandPrefix = platformMap[brandFromEnv];

    this.compViewStream = new KenisisFirehoseStream(stack, 'dwh-compView', `dwh-${brandPrefix}-production-compView`).setup();
    this.compClickStream = new KenisisFirehoseStream(stack, 'dwh-compClick', `dwh-${brandPrefix}-production-compClick`).setup();
    this.compAppViewStream = new KenisisFirehoseStream(stack, 'dwh-compAppView', `dwh-${brandPrefix}-production-compAppView`).setup();
    this.compAppClickStream = new KenisisFirehoseStream(stack, 'dwh-compAppClick', `dwh-${brandPrefix}-production-compAppClick`).setup();
    this.vaultStream = new KenisisFirehoseStream(stack, 'dwh-vault', `dwh-${brandPrefix}-production-vault`).setup();
    this.redemptionTypeStream = new KenisisFirehoseStream(stack, 'dwh-redemption', `dwh-${brandPrefix}-redemption`, {
      tableName: (redshiftSchemaName ? `${redshiftSchemaName}.tblredemption` : undefined)
    }).setup();
		this.callbackVaultRedemptionStreamProd = new KenisisFirehoseStream(stack, 'dwh-callbackVaultRedemptionProd', callbackVaultRedemptionStreamNames.production[brandFromEnv]).setup();
		this.callbackVaultRedemptionStreamDevelop = new KenisisFirehoseStream(stack, 'dwh-callbackVaultRedemptionDevelop', callbackVaultRedemptionStreamNames.staging[brandFromEnv]).setup();

  }
}

class KenisisFirehoseStream {
  constructor(
    private readonly stack: Stack,
    private readonly id: string,
    private readonly streamName: string,
    private readonly redshiftOptions: {
      tableName?: string
    } = {}
  ) {}

  public setup(): IFirehoseStreamAdapter {
    // Note: Unmanaged streams are not created in Production, but will be created in other environments
    if (isProduction(this.stack.stage) && UNMANAGED_STREAMS.includes(this.id)) {
      // Use a reference to an (assumed) existing Firehose stream
      return this.setupStreamReference();
    }

    // Create a new Firehose stream
    return this.setupNewStream();
  }

  private setupStreamReference(): IFirehoseStreamAdapter {
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

  private createRedshiftReference(tableName: string, role: iam.Role, s3: S3Destination): kinesisfirehose.CfnDeliveryStream.RedshiftDestinationConfigurationProperty {
    const secret = getRedshiftSecret(this.stack);
    return {
      clusterJdbcurl: secret.secretValueFromJson('jdbc_url').toString(),
      roleArn: role.roleArn,
      s3Configuration: s3,
      username: secret.secretValueFromJson('username').toString(),
      password: secret.secretValueFromJson('password').toString(),
      copyCommand: {
        dataTableName: tableName,
        copyOptions: `json 'auto'`
      },
      retryOptions: {
        durationInSeconds: 120
      },
    };
  }

  private createS3Reference(
    bucket: s3.Bucket,
    role: iam.Role,
    logGroup: logs.LogGroup,
    logStream: logs.LogStream
  ): kinesisfirehose.CfnDeliveryStream.S3DestinationConfigurationProperty {
    return {
      bucketArn: bucket.bucketArn,
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
    }
  }

  private setupNewStream(): IFirehoseStreamAdapter {
    const streamName = `${this.stack.stage}-${this.streamName}`;

    const destinationBucket = this.createDestinationBucket();
    const deliveryRole = this.createDeliveryRole();
    destinationBucket.grantReadWrite(deliveryRole);

    const { logGroup, logStream } = this.createLogStream(streamName);
    const s3Config = this.createS3Reference(
      destinationBucket,
      deliveryRole,
      logGroup,
      logStream
    );

    const isRedShiftEnvironment = isProduction(this.stack.stage) || isStaging(this.stack.stage);
    const useRedshift = (isRedShiftEnvironment && this.redshiftOptions.tableName);
    const redshiftConfig = useRedshift ? this.createRedshiftReference(
      String(this.redshiftOptions.tableName),
      deliveryRole,
      s3Config,
    ) : undefined;

    const deliveryStream = this.createDeliveryStream(
      streamName,
      redshiftConfig ?? s3Config,
    );

    if(useRedshift) {
      deliveryRole
        .addManagedPolicy(
          iam.ManagedPolicy.fromManagedPolicyArn(this.stack, `AmazonRedShiftFullDataAccess-${this.streamName}`,
            'arn:aws:iam::aws:policy/AmazonRedshiftDataFullAccess')
        );
    }


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

  private createLogStream(streamName: string) {
    const logGroupName = `${streamName}-log-group`;
    const logGroup = new logs.LogGroup(this.stack, logGroupName, {
      removalPolicy: RemovalPolicy.DESTROY,
      retention: logs.RetentionDays.ONE_WEEK,
    });
    const logStream = new logs.LogStream(this.stack, `${streamName}-log-stream`, {
      logGroup,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    return {
      logGroup,
      logStream
    }
  }

  private createDeliveryStream(
    streamName: string,
    destinationConfig: DestinationConfiguration,
  ): kinesisfirehose.CfnDeliveryStream {
    const streamConfig: Partial<Writeable<kinesisfirehose.CfnDeliveryStreamProps>> = {
      deliveryStreamName: streamName,
      deliveryStreamType: 'DirectPut',
    };

    if (this.isRedshiftDestination(destinationConfig)) {
      streamConfig.redshiftDestinationConfiguration = destinationConfig;
    } else {
      streamConfig.s3DestinationConfiguration = destinationConfig;
    }

    return new kinesisfirehose.CfnDeliveryStream(this.stack, streamName, streamConfig);
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

  private isRedshiftDestination(destination: DestinationConfiguration): destination is RedshiftDestination {
    return (destination as RedshiftDestination).clusterJdbcurl !== undefined;
  }
}
