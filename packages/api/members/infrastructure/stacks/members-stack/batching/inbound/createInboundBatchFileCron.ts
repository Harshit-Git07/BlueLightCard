import { Cron, Stack } from 'sst/constructs';
import { SSTFunction } from '@blc-mono/redemptions/infrastructure/constructs/SSTFunction';
import { isStaging } from '@blc-mono/core/utils/checkEnvironment';
import { DynamoDbTables } from '@blc-mono/members/infrastructure/stacks/members-stack/dynamodb/dynamoDbTables';
import { CronJobIds } from '@blc-mono/members/infrastructure/stacks/members-stack/batching/types/cronJobIds';

const EVERY_DAY_AT_30_MINUTES_PAST_4_UK_TIME = 'cron(30 4 * * ? *)';
const EVERY_DAY_AT_30_MINUTES_PAST_4_AU_TIME = 'cron(30 17 * * ? *)';
const EVERY_HOUR_AT_15_MINUTES_PAST = 'cron(15 * * * ? *)';

export function createInboundBatchFileCron(stack: Stack, tables: DynamoDbTables): Cron {
  const retrieveInboundBatchFilesFunction = new SSTFunction(stack, 'inboundBatchFileHandler', {
    handler:
      'packages/api/members/application/handlers/admin/batch/retrieveInboundBatchFiles.handler',
    bind: [tables.adminTable],
  });

  return new Cron(stack, CronJobIds.RETRIEVE_INBOUND_BATCH_FILES, {
    job: retrieveInboundBatchFilesFunction,
    schedule: isStaging(stack.stage)
      ? EVERY_HOUR_AT_15_MINUTES_PAST
      : getCronSchedule(stack.region),
    enabled: true,
  });
}

function getCronSchedule(region: string) {
  return region === 'ap-southeast-2'
    ? EVERY_DAY_AT_30_MINUTES_PAST_4_AU_TIME
    : EVERY_DAY_AT_30_MINUTES_PAST_4_UK_TIME;
}
