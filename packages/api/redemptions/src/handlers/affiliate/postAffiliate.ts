import { APIGatewayEvent, APIGatewayProxyStructuredResultV2 } from 'aws-lambda';

import { LambdaLogger } from '@blc-mono/core/utils/logger/lambdaLogger';
import { Response } from '@blc-mono/core/utils/restResponse/response';

import { AffiliateConfigurationHelper } from '../../helpers/affiliateConfiguration';
import { PostAffiliateModel } from '../../models/postAffiliate';

interface IAPIGatewayEvent extends APIGatewayEvent {
  body: string;
}

const service: string = process.env.service as string;
const logger = new LambdaLogger({ serviceName: `${service}-affiliate-post` });

export const handler = async (event: IAPIGatewayEvent): Promise<APIGatewayProxyStructuredResultV2> => {
  const { affiliateUrl, memberId, platform, offerId, companyId }: PostAffiliateModel = JSON.parse(event.body);
  const affiliateConfig = new AffiliateConfigurationHelper(affiliateUrl).getConfig();

  if (!affiliateConfig) {
    logger.error({
      message: 'Error while creating tracking URL',
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
