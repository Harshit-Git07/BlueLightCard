import { getBrandFromEnv } from '@blc-mono/core/utils/checkBrand';
import { IdentityStackEnvironmentKeys } from '@blc-mono/identity/src/utils/identityStackEnvironmentKeys';
import { PolicyStatement } from "aws-cdk-lib/aws-iam";
import { Stack } from "sst/constructs";
import { LambdaFunction } from 'aws-cdk-lib/aws-events-targets';
import { SSTFunction } from '@blc-mono/identity/src/constructs/SSTFunction';
import { ISecret } from 'aws-cdk-lib/aws-secretsmanager';

export const auth0LogsRule = (
  stack: Stack,
  region: string,
  service: string,
  streamPolicy: PolicyStatement,
  dlqQueue: string,
  streamName: string,
  isDds: boolean,
) => {
  return new LambdaFunction(
    new SSTFunction(stack, `auth0EventLogsHandler${isDds ? 'Dds' : ''}`, {
      permissions: [
        streamPolicy,
        'sqs:sendmessage',
      ],
      handler: 'packages/api/identity/src/auth0/auth0LogsHandler.handler',
      retryAttempts: 2,
      deadLetterQueueEnabled: true,
      environment: {
        [IdentityStackEnvironmentKeys.AUTH0_DWH_FIREHOSE_LOGS_STREAM]: streamName,
        [IdentityStackEnvironmentKeys.DLQ_URL]: dlqQueue,
        [IdentityStackEnvironmentKeys.REGION]: region,
        [IdentityStackEnvironmentKeys.SERVICE]: service,
        [IdentityStackEnvironmentKeys.BRAND]: getBrandFromEnv(),
      },
    }),
  )
};
