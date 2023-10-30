import { Logger } from '@aws-lambda-powertools/logger';

import { Response } from '../../../../core/src/utils/restResponse/response';
import { APIGatewayEvent, APIGatewayProxyStructuredResultV2 } from 'aws-lambda';
export interface IAPIGatewayEvent extends APIGatewayEvent {
  body: string;
}
const service: string = process.env.service as string;
const logger = new Logger({ serviceName: `${service}-post` });

export const handler = async (event: IAPIGatewayEvent): Promise<APIGatewayProxyStructuredResultV2> => {
  logger.info('POST Spotify Proxy Input', { event });

  try {
   // Integration code

    return Response.OK({ message: "Success", data: {} });
  } catch (error) {
    logger.error('Error while creating Spotify code ', { error });

    return Response.Error({ message: 'Error while creating Spotify code' } as Error);
  }
};