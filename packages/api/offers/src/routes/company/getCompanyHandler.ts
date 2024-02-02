import { APIGatewayEvent } from 'aws-lambda';
import { Logger } from '@aws-lambda-powertools/logger';
import { Response } from '../../../../core/src/utils/restResponse/response';

const service: string = process.env.service as string;
const logger = new Logger({ serviceName: `${service}-company-get` });

export const handler = async (event: APIGatewayEvent) => {
  logger.info({ message: 'GET Company Input' });

  return Response.OK({ message: 'Success', data: { offers: 'Welcome to Company' } });
};
