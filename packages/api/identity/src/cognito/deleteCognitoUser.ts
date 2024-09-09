import { Logger } from '@aws-lambda-powertools/logger';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DeleteCommand, DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { sendToDLQ } from 'src/helpers/DLQ';
import { deleteUserFromCognito } from './deleteUserFromCognito';
import { CognitoIdentityProviderClient } from '@aws-sdk/client-cognito-identity-provider';
import { getEnv } from '@blc-mono/core/utils/getEnv';
import { IdentityStackEnvironmentKeys } from '@blc-mono/identity/src/utils/identityStackEnvironmentKeys';

const service: string = getEnv(IdentityStackEnvironmentKeys.SERVICE);
const logger = new Logger({ serviceName: `${service}-deleteUser` });

export const handler = async (event: any) => {
  logger.info('event received', { event });

  if (!event.detail.user_email) {
    logger.info('user_email was not defined in request, not deleting any user', { event });

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'user_email was not defined in request, not deleting any user.',
      }),
    };
  }

  const cognito = new CognitoIdentityProviderClient();
  const userPoolIdDds = getEnv(IdentityStackEnvironmentKeys.USER_POOL_ID_DDS);
  const userPoolId = getEnv(IdentityStackEnvironmentKeys.USER_POOL_ID);
  const oldUserPoolId = getEnv(IdentityStackEnvironmentKeys.OLD_USER_POOL_ID);
  const oldUserPoolIdDds = getEnv(IdentityStackEnvironmentKeys.OLD_USER_POOL_ID_DDS);

  const poolId = !/DDS/i.test(event.detail.brand) ? userPoolId : userPoolIdDds;
  const oldPoolId = !/DDS/i.test(event.detail.brand) ? oldUserPoolId : oldUserPoolIdDds;

  const username = event.detail.user_email;
  const unsuccessfulLoginAttemptsTableName = getEnv(
    IdentityStackEnvironmentKeys.UNSUCCESSFUL_LOGIN_ATTEMPTS_TABLE_NAME,
  );
  const region = getEnv(IdentityStackEnvironmentKeys.REGION);

  try {
    await deleteUserFromCognito(cognito, poolId, username);
    await deleteUserFromCognito(cognito, oldPoolId, username);

    const params = {
      TableName: unsuccessfulLoginAttemptsTableName,
      Key: {
        email: username,
        userPoolId: poolId,
      },
    };

    const dynamoclient = new DynamoDBClient({ region: region });
    const dynamodb = DynamoDBDocumentClient.from(dynamoclient);
    try {
      await dynamodb.send(new DeleteCommand(params));
    } catch (error) {
      logger.debug(
        `Delete command execution failed for user ${username} from dynamoDB table ${unsuccessfulLoginAttemptsTableName}`,
        { error },
      );
      throw error;
    }
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: `User ${username} deleted.`,
      }),
    };
  } catch (error: any) {
    logger.debug(
      `error deleting user ${username} from dynamoDB table ${unsuccessfulLoginAttemptsTableName}`,
      { error },
    );
    await sendToDLQ(event);
    throw new Error(`Error deleting user : ${error.message}.`);
  }
};
