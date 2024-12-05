import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { EventBusRuleProps, Queue, Stack } from 'sst/constructs';

import { RedemptionsStackConfig } from '../../config/config';
import { RedemptionsStackEnvironmentKeys } from '../../constants/environment';
import { SSTFunction } from '../../constructs/SSTFunction';
import { IDatabase } from '../../database/adapter';
import { RedemptionsBallotEvents } from '../events/ballot';

export function runUnsuccessfulBallotRule(
  stack: Stack,
  database: IDatabase,
  config: RedemptionsStackConfig,
): EventBusRuleProps {
  const queue = new Queue(stack, 'RunUnsuccessfulBallotDeadLetterQueue');
  const getSecretValueSecretsManager = new PolicyStatement({
    actions: ['secretsmanager:GetSecretValue'],
    effect: Effect.ALLOW,
    resources: ['*'],
  });
  const runUnsuccessfulBallotHandler = new SSTFunction(stack, 'runUnsuccessfulBallotHandler', {
    database,
    handler:
      'packages/api/redemptions/application/handlers/eventBridge/ballot/runUnsuccessfulBallotHandler.unsuccessfulBallotHandler',
    retryAttempts: 2,
    deadLetterQueueEnabled: true,
    deadLetterQueue: queue.cdk.queue,
    environment: {
      [RedemptionsStackEnvironmentKeys.SECRETS_MANAGER_NAME]: config.secretsManagerConfig.secretsManagerName,
      [RedemptionsStackEnvironmentKeys.BRAZE_API_URL]: config.brazeConfig.brazeApiUrl,
    },
    permissions: [getSecretValueSecretsManager],
    timeout: '15 minutes',
  });
  return {
    pattern: { source: [RedemptionsBallotEvents.BALLOT_UNSUCCESSFUL] },
    targets: {
      runUnsuccessfulBallotHandler,
    },
  };
}
