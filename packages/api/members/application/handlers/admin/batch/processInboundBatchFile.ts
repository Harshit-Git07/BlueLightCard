import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { middleware } from '@blc-mono/members/application/middleware';

const unwrappedHandler = async (event: APIGatewayProxyEvent): Promise<void> => {
  // TODO: Implement handler
};

export const handler = middleware(unwrappedHandler);
