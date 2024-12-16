import { Bucket, Stack, Table } from 'sst/constructs';
import { SSTFunction } from '@blc-mono/redemptions/infrastructure/constructs/SSTFunction';
import { MAP_BRAND } from '@blc-mono/core/constants/common';
import { getBrandFromEnv } from '@blc-mono/core/utils/checkBrand';

export function createProcessInboundBatchFileFunction(
  stack: Stack,
  adminTable: Table,
  profilesTable: Table,
  organisationsTable: Table,
  documentUploadBucket: Bucket,
  batchS3Bucket: Bucket,
): void {
  const processInboundBatchFileFunction = new SSTFunction(stack, 'processInboundBatchFileHandler', {
    handler:
      'packages/api/members/application/handlers/admin/batch/processInboundBatchFile.handler',
    bind: [adminTable, profilesTable, organisationsTable, documentUploadBucket, batchS3Bucket],
    permissions: ['dynamodb:Query', 's3:CopyObject', 's3:DeleteObject'],
  });

  const externalInboundBatchFilesPrefix = `${MAP_BRAND[getBrandFromEnv()]}/inbound/`;
  batchS3Bucket.addNotifications(stack, {
    batchFilesUpload: {
      events: ['object_created'],
      filters: [{ prefix: externalInboundBatchFilesPrefix }],
      function: processInboundBatchFileFunction,
    },
  });
}
