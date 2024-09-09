import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';
import { getEnv, getEnvOrDefault } from '@blc-mono/core/utils/getEnv';
import { IdentityStackEnvironmentKeys } from '@blc-mono/identity/src/utils/identityStackEnvironmentKeys';

const sqs = new SQSClient({
  region: getEnvOrDefault(IdentityStackEnvironmentKeys.REGION, 'eu-west-2'),
});

export async function sendToDLQ(event: any) {
  const dlqUrl = getEnv(IdentityStackEnvironmentKeys.DLQ_URL) || '';
  const params = {
    QueueUrl: dlqUrl,
    MessageBody: JSON.stringify(event),
  };
  await sqs.send(new SendMessageCommand(params));
}
