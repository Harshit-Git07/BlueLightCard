import { Logger } from '@aws-lambda-powertools/logger';
import { FirehoseClient, PutRecordCommand, PutRecordCommandInput } from '@aws-sdk/client-firehose';
import { getEnv } from '@blc-mono/core/utils/getEnv';
import { IdentityStackEnvironmentKeys } from '@blc-mono/identity/src/utils/identityStackEnvironmentKeys';

const service = getEnv(IdentityStackEnvironmentKeys.SERVICE);
const logger = new Logger({ serviceName: service });
const firehose = new FirehoseClient({});

export async function sendDataToFireHose(data: any) {
  const input: PutRecordCommandInput = {
    DeliveryStreamName: getEnv(IdentityStackEnvironmentKeys.DATA_STREAM),
    Record: {
      Data: Buffer.from(JSON.stringify(data)),
    },
  };

  try {
    firehose.send(new PutRecordCommand(input));
  } catch (error) {
    logger.error({ message: 'Error sending to firehose', body: { error } });
  }
}
