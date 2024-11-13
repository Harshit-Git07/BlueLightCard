import { Construct } from 'constructs';
import { Bucket, Function as SSTFunction } from 'sst/constructs';
import { RemovalPolicy } from 'aws-cdk-lib';
import { PolicyStatement, Effect } from 'aws-cdk-lib/aws-iam';

interface IdUploadBucketConstructProps {
  memberProfilesTableName: string;
  noteTableName: string;
  stage: string;
  appName: string;
}

export class IdUploadBucketConstruct extends Construct {
  public readonly bucket: Bucket;
  public readonly s3EventHandler: SSTFunction;

  constructor(scope: Construct, id: string, props: IdUploadBucketConstructProps) {
    super(scope, id);

    const { memberProfilesTableName, noteTableName, stage, appName } = props;

    const bucketName = `${stage}-${appName}-id-upload-bucket`;

    this.bucket = new Bucket(this, 'IDUploadBucket', {
      cdk: {
        bucket: {
          bucketName,
          removalPolicy: RemovalPolicy.RETAIN,
          autoDeleteObjects: false,
        },
      },
    });

    this.s3EventHandler = new SSTFunction(this, 'IDUploadHandler', {
      handler: 'packages/api/members/application/handlers/profile/idUploaded.handler',
      environment: {
        SERVICE: 'members',
        REGION: 'eu-west-2',
        ID_UPLOAD_BUCKET: this.bucket.bucketName,
        IDENTITY_TABLE_NAME: memberProfilesTableName,
        NOTE_TABLE_NAME: noteTableName,
      },
      permissions: [
        this.bucket,
        new PolicyStatement({
          effect: Effect.ALLOW,
          actions: ['dynamodb:Query', 'dynamodb:UpdateItem', 'dynamodb:PutItem'],
          resources: [`arn:aws:dynamodb:*:*:table/${memberProfilesTableName}`],
        }),
        new PolicyStatement({
          effect: Effect.ALLOW,
          actions: ['dynamodb:Query', 'dynamodb:UpdateItem', 'dynamodb:PutItem'],
          resources: [`arn:aws:dynamodb:*:*:table/${noteTableName}`],
        }),
      ],
    });

    this.bucket.addNotifications(this, {
      idUploadNotification: {
        events: ['object_created'],
        filters: [{ prefix: 'UPLOADS/' }],
        function: this.s3EventHandler,
      },
    });
  }
}
