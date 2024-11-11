import { Cron, Queue, Stack } from 'sst/constructs';

import { isStaging } from '@blc-mono/core/utils/checkEnvironment';

import { CronJobs } from '../constants/cronJobs';
import { SSTFunction } from '../constructs/SSTFunction';
import { IDatabase } from '../database/adapter';

const EVERY_DAY_AT_10_PM = 'cron(0 22 * * ? *)';
const EVERY_30_MINUTES = 'rate(30 minutes)';
// const DEV_ONLY_EVERY_2_MINUTES = 'rate(2 minutes)';

export function checkBallotsCron(stack: Stack, database: IDatabase): Cron {
  const queue = new Queue(stack, 'checkBallotDeadLetterQueue');
  const vaultCreatedHandler = new SSTFunction(stack, 'checkBallotHandler', {
    database,
    handler: 'packages/api/redemptions/application/handlers/cron/ballots/checkBallotHandler.handler',
    retryAttempts: 2,
    deadLetterQueueEnabled: true,
    deadLetterQueue: queue.cdk.queue,
  });

  return new Cron(stack, CronJobs.CHECK_BALLOTS, {
    job: vaultCreatedHandler,
    schedule: isStaging(stack.stage) ? EVERY_30_MINUTES : EVERY_DAY_AT_10_PM,
    enabled: true,
  });
}
