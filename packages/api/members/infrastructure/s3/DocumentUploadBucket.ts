import { Construct } from 'constructs';
import { Bucket, Function as SSTFunction, Table } from 'sst/constructs';
import { RemovalPolicy } from 'aws-cdk-lib';

interface DocumentUploadProps {
  profilesTable: Table;
  organisationsTable: Table;
}

export class DocumentUpload extends Construct {
  public readonly bucket: Bucket;
  public readonly s3EventHandler: SSTFunction;

  constructor(scope: Construct, id: string, props: DocumentUploadProps) {
    super(scope, id);

    const { profilesTable, organisationsTable } = props;

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
      bind: [profilesTable, organisationsTable, this.bucket],
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
