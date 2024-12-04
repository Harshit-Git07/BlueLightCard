import { Cron, Stack, Table } from 'sst/constructs';
import { SSTFunction } from '@blc-mono/redemptions/infrastructure/constructs/SSTFunction';
import { CronJobIds } from '@blc-mono/members/infrastructure/crons/cronJobIds';
import { isStaging } from '@blc-mono/core/utils/checkEnvironment';

const EVERY_DAY_AT_30_MINUTES_PAST_4_UK_TIME = 'cron(30 4 * * ? *)';
const EVERY_DAY_AT_30_MINUTES_PAST_4_AU_TIME = 'cron(30 17 * * ? *)';
const EVERY_HOUR_AT_15_MINUTES_PAST = 'cron(15 * * * ? *)';

export function processInboundBatchFileCron(stack: Stack, adminTable: Table): Cron {
  const processInboundBatchFileFunction = new SSTFunction(stack, 'inboundBatchFileHandler', {
    handler:
      'packages/api/members/application/handlers/admin/batch/processInboundBatchFile.handler',
    bind: [adminTable],
  });

  return new Cron(stack, CronJobIds.PROCESS_INBOUND_BATCH_FILE, {
    job: processInboundBatchFileFunction,
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
