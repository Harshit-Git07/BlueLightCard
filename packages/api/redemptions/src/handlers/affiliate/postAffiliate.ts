import { Logger } from '@aws-lambda-powertools/logger';
import { APIGatewayEvent, APIGatewayProxyStructuredResultV2, Context } from 'aws-lambda';
import { Response } from '../../../../core/src/utils/restResponse/response';
import { PostAffiliateResponse } from '../../models/postAffiliateResponse';

const service: string = process.env.service as string;
const logger = new Logger({ serviceName: `${service}-get` });

export const handler = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyStructuredResultV2> => {
  logger.info('input', { event });

  let model: PostAffiliateResponse = { memberId: '1', affiliateUrl: 'J' };

  return Response.OK({ message: 'Success', data: model });
};