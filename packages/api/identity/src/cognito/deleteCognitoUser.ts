import { CognitoIdentityServiceProvider, SQS } from 'aws-sdk';
import { Logger } from '@aws-lambda-powertools/logger';
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


export const handler = async (event: any, context: any) => {
  logger.info('event received', event);
  const cognito = new CognitoIdentityServiceProvider();
  const userPoolId = process.env.USER_POOL_ID || '';
  const username = event.detail.user_email;
  try {
    const existingUser = await cognito.adminGetUser({
        UserPoolId: userPoolId,
        Username: username
    }).promise();
    if (!existingUser) {
        logger.info("user not found: ", { username });
        return {
          statusCode: 200,
          body: JSON.stringify({
            message: `User ${username} not found.`
          })
        };
    }
    logger.info("user found: ", { username });
    await cognito.adminDeleteUser({
        UserPoolId: userPoolId,
        Username: username
    }).promise();
    logger.info("user successfully deleted: ", { username });
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: `User ${username} deleted.`
      })
    };
  } catch (err: any) {
    logger.error("error deleting user ", { username, err });
    await sendToDLQ(event);
    throw new Error(`Error deleting user ${username} : ${err.message}.`)
  }
};




