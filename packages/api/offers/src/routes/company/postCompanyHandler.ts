import { APIGatewayEvent } from 'aws-lambda';
import { Logger } from '@aws-lambda-powertools/logger';
import { Response } from '../../../../core/src/utils/restResponse/response';

const service: string = process.env.service as string;
const logger = new Logger({ serviceName: `${service}-company-post` });

export const handler = async (event: APIGatewayEvent) => {
  logger.info({ message: 'POST Company Input' });

  return Response.OK({ message: 'Success', data: { offers: event.body } });
};
