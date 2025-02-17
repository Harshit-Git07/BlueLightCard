import { Construct } from 'constructs';
import { DocumentUploadBucket } from '@blc-mono/members/infrastructure/stacks/members-stack/s3/buckets/documentUploadBucket';
import { EmailBucket } from '@blc-mono/members/infrastructure/stacks/members-stack/s3/buckets/emailBucket';
import { App, Bucket, Stack } from 'sst/constructs';
import { DynamoDbTables } from '@blc-mono/members/infrastructure/stacks/members-stack/dynamodb/dynamoDbTables';
import { BatchFilesBucket } from '@blc-mono/members/infrastructure/stacks/members-stack/s3/buckets/batchFilesBucket';

export class Buckets extends Construct {
  readonly documentUploadBucket: Bucket;
  readonly batchFilesBucket: Bucket;
  readonly emailBucket: EmailBucket;

  constructor(app: App, stack: Stack, tables: DynamoDbTables) {
    super(stack, 'Buckets');

    this.documentUploadBucket = new DocumentUploadBucket(stack, tables).bucket;
    this.batchFilesBucket = new BatchFilesBucket(stack).bucket;
    this.emailBucket = new EmailBucket(app, stack);
  }
}
