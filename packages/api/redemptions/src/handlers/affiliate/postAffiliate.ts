import { APIGatewayEvent, APIGatewayProxyStructuredResultV2 } from 'aws-lambda';

import { Logger } from '@blc-mono/core/src/utils/logger/logger';
import { Response } from '@blc-mono/core/src/utils/restResponse/response';

import { AffiliateConfigurationHelper } from '../../helpers/affiliateConfiguration';
import { PostAffiliateModel } from '../../models/postAffiliate';

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
  const { affiliateUrl, memberId, platform, offerId, companyId }: PostAffiliateModel = JSON.parse(event.body);
  const affiliateConfig = new AffiliateConfigurationHelper(affiliateUrl).getConfig();

  if (!affiliateConfig) {
    logger.error({
      message: 'Affiliate not supported',
      body: { affiliateUrl, platform },
    });

    return Response.Error(new Error('Error while creating tracking URL (affiliate not supported)'));
  }

  const trackingUrl: string = affiliateConfig.getTrackingUrl(memberId);
  const response = Response.OK({ message: 'Success', data: { trackingUrl } });

  logger.info({
    message: 'Successful affiliate url request',
    body: {
      affiliateUrl,
      trackingUrl,
      platform,
      companyId,
      offerId,
    },
    status: response.statusCode,
  });

  return response;
};
