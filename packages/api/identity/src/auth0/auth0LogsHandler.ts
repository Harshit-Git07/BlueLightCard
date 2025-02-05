import { sendToDLQ } from "src/helpers/DLQ";
import { Logger } from '@aws-lambda-powertools/logger';
import { getEnv, getEnvOrDefault } from '@blc-mono/core/utils/getEnv';
import { IdentityStackEnvironmentKeys } from '@blc-mono/identity/src/utils/identityStackEnvironmentKeys';
import { FirehoseClient, PutRecordCommand } from '@aws-sdk/client-firehose';
import { Auth0EventTypes } from '@blc-mono/identity/src/auth0/auth0EventTypes.enum';
import { EventBridgeEvent } from 'aws-lambda';
import { Response } from '../../../core/src/utils/restResponse/response';

const service: string = getEnv(IdentityStackEnvironmentKeys.SERVICE);
const logLevel =
  getEnvOrDefault(IdentityStackEnvironmentKeys.DEBUG_LOGGING_ENABLED, 'false').toLowerCase() ==
  'true'
    ? 'DEBUG'
    : 'INFO';
const logger = new Logger({
  serviceName: `${service}-auth0LogsHandler`,
  logLevel: logLevel,
});

type LogData = {
    date: string;
    type: string;
    client_name: string;
    user_id: string;
    user_name: string;
};

export const handler = async (event: EventBridgeEvent<any, any>) : Promise<object> => {
  logger.info('event received', { event });

  if (!event.detail?.data) {
    logger.error('event details are missing', { event });
    return Response.BadRequest({ message: 'Please provide valid event details' });
  }
  const streamName: string = getEnv(IdentityStackEnvironmentKeys.AUTH0_DWH_FIREHOSE_LOGS_STREAM);
  const brand: string = getEnv(IdentityStackEnvironmentKeys.BRAND);

  const eventLog = event.detail.data as LogData;

  const command = new PutRecordCommand({
    DeliveryStreamName: streamName,
    Record: {
      Data: Buffer.from(
        JSON.stringify({
          member_id: eventLog.user_id.replace('auth0|', ''),
          event_time: eventLog.date.split('.')[0]+"Z",
          brand: brand,  
          client_type: eventLog.client_name,
          event_type: Auth0EventTypes[eventLog.type as keyof typeof Auth0EventTypes],
        }),
      ),
    },
  });
  try{
    const client = new FirehoseClient();
    await client.send(command);
    return Response.OK({ message: 'auth0 logs processed successfully' });
  } catch (err: any) {
      logger.error('error handling auth0 logs', { err });
      await sendToDLQ(event);
      return Response.Error(err as Error);
  }
}
