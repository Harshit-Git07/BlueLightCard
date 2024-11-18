import { EventBusRuleProps, Queue, Stack } from 'sst/constructs';

import { SSTFunction } from '../../constructs/SSTFunction';
import { IDatabase } from '../../database/adapter';
import { RedemptionsBallotEvents } from '../events/ballot';

export function runBallotRule(stack: Stack, database: IDatabase): EventBusRuleProps {
  const queue = new Queue(stack, 'RunBallotDeadLetterQueue');
  const runBallotHandler = new SSTFunction(stack, 'runBallotHandler', {
    database,
    handler: 'packages/api/redemptions/application/handlers/eventBridge/ballot/runBallotHandler.handler',
    retryAttempts: 0,
    deadLetterQueueEnabled: true,
    deadLetterQueue: queue.cdk.queue,
  });
  return {
    pattern: { source: [RedemptionsBallotEvents.BALLOT_RUN] },
    targets: {
      runBallotHandler,
    },
  };
}
