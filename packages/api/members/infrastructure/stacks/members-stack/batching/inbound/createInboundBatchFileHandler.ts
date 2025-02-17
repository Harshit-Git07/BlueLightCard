import { Stack } from 'sst/constructs';
import { SSTFunction } from '@blc-mono/redemptions/infrastructure/constructs/SSTFunction';
import { MAP_BRAND } from '@blc-mono/core/constants/common';
import { getBrandFromEnv } from '@blc-mono/core/utils/checkBrand';
import { DynamoDbTables } from '@blc-mono/members/infrastructure/stacks/members-stack/dynamodb/dynamoDbTables';
import { Buckets } from '@blc-mono/members/infrastructure/stacks/members-stack/s3/buckets';

export function createInboundBatchFileHandler(
  stack: Stack,
  tables: DynamoDbTables,
  buckets: Buckets,
): void {
  const processInboundBatchFileFunction = new SSTFunction(stack, 'processInboundBatchFileHandler', {
    handler:
      'packages/api/members/application/handlers/admin/batch/processInboundBatchFile.handler',
    bind: [tables.adminTable, tables.profilesTable, buckets.batchFilesBucket],
    permissions: ['dynamodb:Query', 's3:CopyObject', 's3:DeleteObject'],
  });

  const externalInboundBatchFilesPrefix = `${MAP_BRAND[getBrandFromEnv()]}/inbound/`;
  buckets.batchFilesBucket.addNotifications(stack, {
    batchFilesUpload: {
      events: ['object_created'],
      filters: [{ prefix: externalInboundBatchFilesPrefix }],
      function: processInboundBatchFileFunction,
    },
  });
}
