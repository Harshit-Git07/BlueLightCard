import { APIGatewayProxyEvent } from 'aws-lambda';
import { LambdaLogger as Logger } from '@blc-mono/core/utils/logger/lambdaLogger';

interface ValidatedRequest {
  memberUUID: string;
  body: any;
}

export function validateRequest(
  event: APIGatewayProxyEvent,
  logger: Logger,
): ValidatedRequest | { statusCode: number; body: string } {
  if (!event.body) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Missing request body' }),
    };
  }

  const memberUUID = event.pathParameters?.memberUUID;
  if (!memberUUID) {
    logger.warn({ message: `Invalid member UUID provided: ${memberUUID}` });
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Missing memberUUID' }),
    };
  }

  return {
    memberUUID: memberUUID,
    body: JSON.parse(event.body),
  };
}
