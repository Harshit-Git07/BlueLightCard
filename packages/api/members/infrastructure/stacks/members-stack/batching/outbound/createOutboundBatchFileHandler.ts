import { Queue, Stack } from 'sst/constructs';
import { SSTFunction } from '@blc-mono/redemptions/infrastructure/constructs/SSTFunction';
import { MAP_BRAND } from '@blc-mono/core/constants/common';
import { getBrandFromEnv } from '@blc-mono/core/utils/checkBrand';
import { DynamoDbTables } from '@blc-mono/members/infrastructure/stacks/members-stack/dynamodb/dynamoDbTables';
import { Buckets } from '@blc-mono/members/infrastructure/stacks/members-stack/s3/buckets';

export function createOutboundBatchFileHandler(
  stack: Stack,
  tables: DynamoDbTables,
  buckets: Buckets,
): void {
  const uploadBatchFileDeadLetterQueue = new Queue(stack, 'UploadBatchFileDeadLetterQueue');

  const uploadBatchFileFunction = new SSTFunction(stack, 'uploadBatchFileHandler', {
    handler: 'packages/api/members/application/handlers/admin/batch/events/uploadBatchFile.handler',
    bind: [tables.adminTable, tables.profilesTable, buckets.batchFilesBucket],
    deadLetterQueue: uploadBatchFileDeadLetterQueue.cdk.queue,
    deadLetterQueueEnabled: true,
    retryAttempts: 2,
  });

  const externalBatchFilesPrefix = `${MAP_BRAND[getBrandFromEnv()]}/outbound/`;
  buckets.batchFilesBucket.addNotifications(stack, {
    batchFilesUpload: {
      events: ['object_created'],
      filters: [{ prefix: externalBatchFilesPrefix }],
      function: uploadBatchFileFunction,
    },
  });
}
