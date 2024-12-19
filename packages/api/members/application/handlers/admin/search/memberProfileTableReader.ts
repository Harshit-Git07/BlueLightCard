import { lambdaMiddleware } from '../../../middleware';
import { Repository } from '@blc-mono/members/application/repositories/repository';
import { NativeAttributeValue } from '@aws-sdk/lib-dynamodb';
import { SendMessageCommand, SQSClient } from '@aws-sdk/client-sqs';
import { getEnvOrDefault } from '@blc-mono/core/utils/getEnv';
import { MemberStackEnvironmentKeys } from '@blc-mono/members/infrastructure/constants/environment';
import {
  getMemberProfilesTableName,
  getSeedSearchIndexTableQueueUrl,
} from '@blc-mono/members/application/handlers/admin/search/getMemberProfileResources';

const region: string = getEnvOrDefault(MemberStackEnvironmentKeys.REGION, 'eu-west-2');
const sqs = new SQSClient({ region: region });

const repository = new Repository();
const tableName = getMemberProfilesTableName();
const queueUrl = getSeedSearchIndexTableQueueUrl();

const MAX_SQS_EVENT_BATCH_SIZE = 100;

const unwrappedHandler = async () => {
  await scanAndQueueMemberProfileRecords();
};

const scanAndQueueMemberProfileRecords = async () => {
  let lastEvaluatedKey: Record<string, NativeAttributeValue> | undefined = undefined;

  do {
    const result = await repository.scan({
      TableName: tableName,
      Limit: 500,
      ExclusiveStartKey: lastEvaluatedKey,
    });

    if (result.Items && result.Items.length > 0) {
      for (let i = 0; i < result.Items.length; i += MAX_SQS_EVENT_BATCH_SIZE) {
        const chunk = result.Items.slice(i, i + MAX_SQS_EVENT_BATCH_SIZE);
        const messageBody = JSON.stringify(chunk);

        await sqs.send(
          new SendMessageCommand({
            QueueUrl: queueUrl,
            MessageBody: messageBody,
          }),
        );
      }
    }

    lastEvaluatedKey = result.LastEvaluatedKey;
  } while (lastEvaluatedKey);
};

export const handler = lambdaMiddleware(unwrappedHandler);
