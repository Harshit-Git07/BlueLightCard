import { Bucket, Cron, Stack, Table } from 'sst/constructs';
import { isStaging } from '@blc-mono/core/utils/checkEnvironment';
import { SSTFunction } from '@blc-mono/redemptions/infrastructure/constructs/SSTFunction';
import { CronJobIds } from '@blc-mono/members/infrastructure/crons/cronJobIds';

const EVERY_DAY_AT_MIDNIGHT_UK_TIME = 'cron(0 0 * * ? *)';
const EVERY_DAY_AT_MIDNIGHT_AU_TIME = 'cron(0 13 * * ? *)';
const EVERY_HOUR_AT_30_MINUTES_PAST = 'cron(30 * * * ? *)';

export function createOutboundBatchFileCron(
  stack: Stack,
  adminTable: Table,
  profilesTable: Table,
  organisationsTable: Table,
  documentUploadBucket: Bucket,
  batchS3Bucket: Bucket,
): Cron {
  const outboundBatchFileFunction = new SSTFunction(stack, 'outboundBatchFileHandler', {
    handler:
      'packages/api/members/application/handlers/admin/batch/createOutboundBatchFile.handler',
    bind: [adminTable, profilesTable, organisationsTable, documentUploadBucket, batchS3Bucket],
    permissions: ['dynamodb:Query', 'dynamodb:Scan', 'dynamodb:UpdateItem', 'dynamodb:PutItem'],
  });

  return new Cron(stack, CronJobIds.CREATE_OUTBOUND_BATCH_FILE, {
    job: outboundBatchFileFunction,
    schedule: isStaging(stack.stage)
      ? EVERY_HOUR_AT_30_MINUTES_PAST
      : getCronSchedule(stack.region),
    enabled: true,
  });
}

function getCronSchedule(region: string) {
  return region === 'ap-southeast-2'
    ? EVERY_DAY_AT_MIDNIGHT_AU_TIME
    : EVERY_DAY_AT_MIDNIGHT_UK_TIME;
}
