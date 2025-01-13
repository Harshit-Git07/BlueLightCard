import { Cron, Queue, Stack } from 'sst/constructs';

import { isStaging } from '@blc-mono/core/utils/checkEnvironment';
import { DwhKenisisFirehoseStreams } from '@blc-mono/shared/infra/firehose/DwhKenisisFirehoseStreams';

import { RedemptionsStackEnvironmentKeys } from '../constants/environment';
import { SSTFunction } from '../constructs/SSTFunction';
import { IDatabase } from '../database/adapter';

import { RedemptionsCronJobs } from './RedemptionsCronJobs';
const EVERY_DAY_AT_10_PM = 'cron(0 22 * * ? *)';
const EVERY_HOUR = 'rate(1 hour)';

export function vaultStockDwhCron(
  stack: Stack,
  database: IDatabase,
  dwhKenisisFirehoseStreams: DwhKenisisFirehoseStreams,
): Cron {
  const queue = new Queue(stack, 'DLQVaultStockDwhCron');
  const logVaultStockDwhHandler = new SSTFunction(stack, 'logVaultStockDwhHandler', {
    database,
    handler: 'packages/api/redemptions/application/handlers/cron/vaultStock/logVaultStockDwhHandler.handler',
    retryAttempts: 2,
    deadLetterQueueEnabled: true,
    deadLetterQueue: queue.cdk.queue,
    timeout: '15 minutes',
    environment: {
      [RedemptionsStackEnvironmentKeys.DWH_FIREHOSE_VAULT_STOCK_STREAM_NAME]:
        dwhKenisisFirehoseStreams.vaultStockStream.getStreamName(),
      [RedemptionsStackEnvironmentKeys.DWH_FIREHOSE_VAULT_BATCH_STOCK_STREAM_NAME]:
        dwhKenisisFirehoseStreams.vaultBatchStockStream.getStreamName(),
    },
    permissions: [
      dwhKenisisFirehoseStreams.vaultStockStream.getPutRecordPolicyStatement(),
      dwhKenisisFirehoseStreams.vaultBatchStockStream.getPutRecordPolicyStatement(),
    ],
  });

  return new Cron(stack, RedemptionsCronJobs.VAULT_STOCK, {
    job: logVaultStockDwhHandler,
    schedule: isStaging(stack.stage) ? EVERY_DAY_AT_10_PM : EVERY_HOUR,
    enabled: true,
  });
}
