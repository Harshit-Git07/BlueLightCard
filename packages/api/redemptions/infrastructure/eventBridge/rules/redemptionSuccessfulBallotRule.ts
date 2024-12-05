import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { EventBusRuleProps, Queue, Stack } from 'sst/constructs';

import { RedemptionsStackConfig } from '../../config/config';
import { RedemptionsStackEnvironmentKeys } from '../../constants/environment';
import { SSTFunction } from '../../constructs/SSTFunction';
import { IDatabase } from '../../database/adapter';
import { RedemptionsBallotEvents } from '../events/ballot';

export function runSuccessfulBallotRule(
  stack: Stack,
  database: IDatabase,
  config: RedemptionsStackConfig,
): EventBusRuleProps {
  const queue = new Queue(stack, 'RunSuccessfulBallotDeadLetterQueue');
  const getSecretValueSecretsManager = new PolicyStatement({
    actions: ['secretsmanager:GetSecretValue'],
    effect: Effect.ALLOW,
    resources: ['*'],
  });
  const runSuccessfulBallotHandler = new SSTFunction(stack, 'runSuccessfulBallotHandler', {
    database,
    handler:
      'packages/api/redemptions/application/handlers/eventBridge/ballot/runSuccessfulBallotHandler.successfulBallotHandler',
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
    pattern: { source: [RedemptionsBallotEvents.BALLOT_SUCCESSFUL] },
    targets: {
      runSuccessfulBallotHandler,
    },
  };
}
