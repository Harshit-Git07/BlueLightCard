import { APIGatewayProxyEvent } from 'aws-lambda';
import { Logger } from '@aws-lambda-powertools/logger';

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
    logger.warn(`Invalid member UUID provided: ${memberUUID}`);
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
