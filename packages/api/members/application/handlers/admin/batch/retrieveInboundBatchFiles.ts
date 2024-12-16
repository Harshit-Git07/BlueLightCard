import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { middleware } from '@blc-mono/members/application/middleware';

const unwrappedHandler = async (event: APIGatewayProxyEvent): Promise<void> => {
  // TODO: Implement handler
  // should implement retrieving all files currently on SFTP server and uploading them to S3 bucket
};

export const handler = middleware(unwrappedHandler);
