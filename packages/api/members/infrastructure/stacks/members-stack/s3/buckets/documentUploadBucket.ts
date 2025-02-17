import { Construct } from 'constructs';
import { Bucket, Function as SSTFunction, Stack } from 'sst/constructs';
import { RemovalPolicy } from 'aws-cdk-lib';
import { DynamoDbTables } from '@blc-mono/members/infrastructure/stacks/members-stack/dynamodb/dynamoDbTables';

export class DocumentUploadBucket extends Construct {
  readonly bucket: Bucket;
  readonly s3EventHandler: SSTFunction;

  constructor(stack: Stack, tables: DynamoDbTables) {
    super(stack, 'DocumentUpload');

    const { profilesTable } = tables;

    // Need to use `this` here to ensure cloudformation knows that it already exists, can perhaps remake later for consistency though!
    this.bucket = new Bucket(this, 'documentUploadBucket', {
      cdk: {
        bucket: {
          removalPolicy: RemovalPolicy.RETAIN,
          autoDeleteObjects: false,
        },
      },
    });

    this.s3EventHandler = new SSTFunction(this, 'IDUploadHandler', {
      handler: 'packages/api/members/application/handlers/s3/documentUploaded.handler',
      environment: {
        SERVICE: 'members',
        REGION: 'eu-west-2',
        ID_UPLOAD_BUCKET: this.bucket.bucketName,
      },
      bind: [profilesTable, this.bucket],
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
