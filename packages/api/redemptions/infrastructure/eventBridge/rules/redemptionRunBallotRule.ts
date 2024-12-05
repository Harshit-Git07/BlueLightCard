import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { EventBusRuleProps, Queue, Stack } from 'sst/constructs';

import { RedemptionsStackEnvironmentKeys } from '../../constants/environment';
import { SSTFunction } from '../../constructs/SSTFunction';
import { IDatabase } from '../../database/adapter';
import { RedemptionsBallotEvents } from '../events/ballot';

const putEventsPolicy = new PolicyStatement({
  actions: ['events:PutEvents'],
  effect: Effect.ALLOW,
  resources: ['*'],
});

export function runBallotRule(stack: Stack, database: IDatabase, eventBusName: string): EventBusRuleProps {
  const queue = new Queue(stack, 'RunBallotDeadLetterQueue');
  const runBallotHandler = new SSTFunction(stack, 'runBallotHandler', {
    database,
    handler: 'packages/api/redemptions/application/handlers/eventBridge/ballot/runBallotHandler.ballotHandler',
    retryAttempts: 0,
    deadLetterQueueEnabled: true,
    deadLetterQueue: queue.cdk.queue,
    permissions: [putEventsPolicy],
    environment: {
      [RedemptionsStackEnvironmentKeys.REDEMPTIONS_EVENT_BUS_NAME]: eventBusName,
    },
  });
  return {
    pattern: { source: [RedemptionsBallotEvents.BALLOT_RUN] },
    targets: {
      runBallotHandler,
    },
  };
}
