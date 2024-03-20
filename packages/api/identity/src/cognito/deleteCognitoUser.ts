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

        logger.debug("user found");

      await cognito.adminDeleteUser({
          UserPoolId: poolId,
          Username: username
      }).promise();

    logger.info("user successfully deleted from Cognito ");
  } catch (e: any) {
    logger.debug("user not found");
  
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: `User ${username} not found.`
      })
    };
  }
}


export const handler = async (event: any, context: any) => {
  logger.info('event received', event);
  const cognito = new CognitoIdentityServiceProvider();
  const userPoolIdDds = process.env.USER_POOL_ID_DDS || '';
  const userPoolId = process.env.USER_POOL_ID || '';
  const oldUserPoolId = process.env.OLD_USER_POOL_ID || '';
  const oldUserPoolIdDds = process.env.OLD_USER_POOL_ID_DDS || '';

  const poolId =(!/DDS/i.test(event.detail.brand)) ? userPoolId : userPoolIdDds;
  const oldPoolId =(!/DDS/i.test(event.detail.brand)) ? oldUserPoolId : oldUserPoolIdDds;

  const username = event.detail.user_email;
  const table = process.env.TABLE_NAME;
  const region = process.env.REGION;
  try {
    await deleteCognitoUser(cognito, poolId, username);
    await deleteCognitoUser(cognito, oldPoolId, username);

    const params = {
      TableName: table,
      Key: {
        pk: username,
        sk: poolId,
      }
    };
  
    const dynamoclient = new DynamoDBClient({region: region});
    const dynamodb = DynamoDBDocumentClient.from(dynamoclient);
    try {
      await dynamodb.send(new DeleteCommand(params));  
    } catch (error) {
      logger.debug("Error deleting from table", { error });
      throw error;
    }
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: `User ${username} deleted.`
      })
    };
  } catch (err: any) {
    logger.debug("error deleting user from dynamoDB ", { err });
    await sendToDLQ(event);
    throw new Error(`Error deleting user ${username} : ${err.message}.`)
  }
};




