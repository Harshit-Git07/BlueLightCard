import { CognitoIdentityServiceProvider, SQS } from 'aws-sdk';
import { Logger } from '@aws-lambda-powertools/logger';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DeleteCommand, DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
const service: string = process.env.SERVICE as string
const logger = new Logger({ serviceName: `${service}-deleteUser` })
const sqs = new SQS();

// Function to send a message to SQS Queue
async function sendToDLQ(event: any) {
  const dlqUrl = process.env.DLQ_URL || '';
  const params = {
    QueueUrl: dlqUrl,
    MessageBody: JSON.stringify(event)
  };
  await sqs.sendMessage(params).promise();
}

const deleteCognitoUser = async (cognito: CognitoIdentityServiceProvider, poolId: string, username: string) => {
  try {
      await cognito.adminGetUser({
        UserPoolId: poolId,
        Username: username
      }).promise();

      logger.debug("user found on cognito");

      await cognito.adminDeleteUser({
          UserPoolId: poolId,
          Username: username
      }).promise();

    logger.info("user successfully deleted from Cognito");
  } catch (e: any) {
    logger.debug("user not found on cognito");

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: `User ${username} not found on Cognito.`
      })
    };
  }
}


export const handler = async (event: any) => {
  logger.info('event received', { event });

  if (!event.detail.user_email) {
    logger.info('user_email was not defined in request, not deleting any user', { event });

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'user_email was not defined in request, not deleting any user.'
      })
    };
  }

  const cognito = new CognitoIdentityServiceProvider();
  const userPoolIdDds = process.env.USER_POOL_ID_DDS || '';
  const userPoolId = process.env.USER_POOL_ID || '';
  const oldUserPoolId = process.env.OLD_USER_POOL_ID || '';
  const oldUserPoolIdDds = process.env.OLD_USER_POOL_ID_DDS || '';

  const poolId =(!/DDS/i.test(event.detail.brand)) ? userPoolId : userPoolIdDds;
  const oldPoolId =(!/DDS/i.test(event.detail.brand)) ? oldUserPoolId : oldUserPoolIdDds;

  const username = event.detail.user_email;
  const unsuccessfulLoginAttemptsTableName = process.env.UNSUCCESSFUL_LOGIN_ATTEMPTS_TABLE_NAME as string;
  const region = process.env.REGION;
  try {
    await deleteCognitoUser(cognito, poolId, username);
    await deleteCognitoUser(cognito, oldPoolId, username);

    const params = {
      TableName: unsuccessfulLoginAttemptsTableName,
      Key: {
        email: username,
        userPoolId: poolId,
      }
    };

    const dynamoclient = new DynamoDBClient({region: region});
    const dynamodb = DynamoDBDocumentClient.from(dynamoclient);
    try {
      await dynamodb.send(new DeleteCommand(params));
    } catch (error) {
      logger.debug(`Delete command execution failed for user ${username} from dynamoDB table ${unsuccessfulLoginAttemptsTableName}`, { error });
      throw error;
    }
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: `User ${username} deleted.`
      })
    };
  } catch (error: any) {
    logger.debug(`error deleting user ${username} from dynamoDB table ${unsuccessfulLoginAttemptsTableName}`, { error });
    await sendToDLQ(event);
    throw new Error(`Error deleting user : ${error.message}.`)
  }
};




