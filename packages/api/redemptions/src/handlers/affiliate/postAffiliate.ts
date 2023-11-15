import { Logger } from '@aws-lambda-powertools/logger';
import { APIGatewayEvent, APIGatewayProxyStructuredResultV2 } from 'aws-lambda';
import { Response } from '../../../../core/src/utils/restResponse/response';
import { AffiliateConfiguration } from '../../helpers/affiliateConfiguration';
import { PostAffiliateModel } from '../../models/postAffiliate';

interface IAPIGatewayEvent extends APIGatewayEvent {
  body: string;
}

const service: string = process.env.service as string;
const logger = new Logger({ serviceName: `${service}-post` });

export const handler = async (event: IAPIGatewayEvent): Promise<APIGatewayProxyStructuredResultV2> => {
  logger.info('POST Affiliate Input', { event });

  try {
    const { affiliateUrl, memberId }: PostAffiliateModel = JSON.parse(event.body);
    const trackingUrl: string = new AffiliateConfiguration(affiliateUrl, memberId).trackingUrl;

    return Response.OK({ message: 'Success', data: { trackingUrl } });
  } catch (error) {
    logger.error('Error while creating tracking URL ', { error });

    return Response.Error(new Error( 'Error while creating tracking URL'));
  }
};
