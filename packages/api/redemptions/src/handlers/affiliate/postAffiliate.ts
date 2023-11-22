import { APIGatewayEvent, APIGatewayProxyStructuredResultV2 } from 'aws-lambda';
import { Response } from '@blc-mono/core/src/utils/restResponse/response';
import { AffiliateConfiguration } from '../../helpers/affiliateConfiguration';
import { PostAffiliateModel } from '../../models/postAffiliate';
import { Logger } from '@blc-mono/core/src/utils/logger/logger';

interface IAPIGatewayEvent extends APIGatewayEvent {
  body: string;
}

const service: string = process.env.service as string;
const logger = new Logger();

logger.init({ serviceName: `${service}-affiliate-post` });

export const handler = async (event: IAPIGatewayEvent): Promise<APIGatewayProxyStructuredResultV2> => {
  logger.info({
    message: 'POST Affiliate Input',
  });

  try {
    const { affiliateUrl, memberId }: PostAffiliateModel = JSON.parse(event.body);
    const trackingUrl: string = new AffiliateConfiguration(affiliateUrl, memberId).trackingUrl;
    const response = Response.OK({ message: 'Success', data: { trackingUrl } });

    logger.info({
      message: 'Successful affiliate url request',
      body: JSON.stringify({ affiliateUrl, trackingUrl }),
      status: response.statusCode,
    });

    return response;
  } catch (error) {
    logger.error({
      message: 'Error while creating tracking URL',
    });

    return Response.Error(new Error('Error while creating tracking URL'));
  }
};
