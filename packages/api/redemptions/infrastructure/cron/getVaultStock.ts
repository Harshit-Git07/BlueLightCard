import { Cron, Queue, Stack } from 'sst/constructs';

import { isStaging } from '@blc-mono/core/utils/checkEnvironment';

import { SSTFunction } from '../constructs/SSTFunction';

import { RedemptionsCronJobs } from './RedemptionsCronJobs';

const EVERY_DAY_AT_10_PM = 'cron(0 22 * * ? *)';
const EVERY_HOUR = 'rate(1 hour)';

export function vaultStockCron(stack: Stack): Cron {
  const queue = new Queue(stack, 'DLQVaultStockCron');
  const getVaultStockHandler = new SSTFunction(stack, 'getVaultStockHandler', {
    handler: 'packages/api/redemptions/application/handlers/cron/vaultStock/getVaultStockHandler.handler',
    retryAttempts: 2,
    deadLetterQueueEnabled: true,
    deadLetterQueue: queue.cdk.queue,
    permissions: [],
    environment: {},
  });

  return new Cron(stack, RedemptionsCronJobs.VAULT_STOCK, {
    job: getVaultStockHandler,
    schedule: isStaging(stack.stage) ? EVERY_DAY_AT_10_PM : EVERY_HOUR,
    enabled: true,
  });
}
