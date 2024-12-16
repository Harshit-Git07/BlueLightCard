import { Bucket, Queue, Stack, Table } from 'sst/constructs';
import { SSTFunction } from '@blc-mono/redemptions/infrastructure/constructs/SSTFunction';
import { MAP_BRAND } from '@blc-mono/core/constants/common';
import { getBrandFromEnv } from '@blc-mono/core/utils/checkBrand';

export function createUploadBatchFileFunction(
  stack: Stack,
  adminTable: Table,
  profilesTable: Table,
  organisationsTable: Table,
  documentUploadBucket: Bucket,
  batchS3Bucket: Bucket,
): void {
  const uploadBatchFileDLQ: Queue = new Queue(stack, 'UploadBatchFileDeadLetterQueue');
  const uploadBatchFileFunction = new SSTFunction(stack, 'uploadBatchFileHandler', {
    handler: 'packages/api/members/application/handlers/admin/batch/uploadBatchFile.handler',
    bind: [adminTable, profilesTable, organisationsTable, documentUploadBucket, batchS3Bucket],
    deadLetterQueue: uploadBatchFileDLQ.cdk.queue,
    deadLetterQueueEnabled: true,
    retryAttempts: 3,
  });

  const externalBatchFilesPrefix = `${MAP_BRAND[getBrandFromEnv()]}/outbound/`;
  batchS3Bucket.addNotifications(stack, {
    batchFilesUpload: {
      events: ['object_created'],
      filters: [{ prefix: externalBatchFilesPrefix }],
      function: uploadBatchFileFunction,
    },
  });
}
