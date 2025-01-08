import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { Cron, Queue, Stack } from 'sst/constructs';

import { isStaging } from '@blc-mono/core/utils/checkEnvironment';
import { RedemptionsStackConfig } from '@blc-mono/redemptions/infrastructure/config/config';

import { RedemptionsStackEnvironmentKeys } from '../constants/environment';
import { SSTFunction } from '../constructs/SSTFunction';
import { IDatabase } from '../database/adapter';

import { RedemptionsCronJobs } from './RedemptionsCronJobs';

const EVERY_DAY_AT_10_PM = 'cron(0 22 * * ? *)';
const EVERY_30_MINUTES = 'rate(30 minutes)';

const putEventsPolicy = new PolicyStatement({
  actions: ['events:PutEvents'],
  effect: Effect.ALLOW,
  resources: ['*'],
});

export function checkBallotsCron(
  stack: Stack,
  database: IDatabase,
  eventBusName: string,
  config: RedemptionsStackConfig,
): Cron {
  const queue = new Queue(stack, 'checkBallotDeadLetterQueue');
  const checkBallotHandler = new SSTFunction(stack, 'checkBallotHandler', {
    database,
    handler: 'packages/api/redemptions/application/handlers/cron/ballots/checkBallotsHandler.handler',
    retryAttempts: 2,
    deadLetterQueueEnabled: true,
    deadLetterQueue: queue.cdk.queue,
    permissions: [putEventsPolicy],
    timeout: '15 minutes',
    environment: {
      [RedemptionsStackEnvironmentKeys.REDEMPTIONS_EVENT_BUS_NAME]: eventBusName,
      [RedemptionsStackEnvironmentKeys.BRAZE_API_URL]: config.brazeConfig.brazeApiUrl,
    },
  });

  return new Cron(stack, RedemptionsCronJobs.BALLOT_CHECK, {
    job: checkBallotHandler,
    schedule: isStaging(stack.stage) ? EVERY_30_MINUTES : EVERY_DAY_AT_10_PM,
    enabled: true,
  });
}
