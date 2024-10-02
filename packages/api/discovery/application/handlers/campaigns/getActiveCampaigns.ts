import { APIGatewayEvent } from 'aws-lambda';
import { APIGatewayProxyEventQueryStringParameters } from 'aws-lambda/trigger/api-gateway-proxy';
import { z } from 'zod';

import { LambdaLogger } from '@blc-mono/core/utils/logger/lambdaLogger';
import { mapCampaignData } from '@blc-mono/discovery/helpers/mapCampaignData';

import campaigns from '../../../data/campaigns.json';
import { CampaignEventsSchema } from '../../../schemas/campaigns';
import { CampaignEvent, CampaignType, getActiveCampaigns } from '../../services/campaigns';

const logger = new LambdaLogger({ serviceName: 'getActiveCampaigns' });

const querySchema = z.object({
  type: z.enum([CampaignType.ThankYouCampaign, CampaignType.BlackFriday]),
});

export const handler = async (event: APIGatewayEvent) => {
  const queryParams = event.queryStringParameters as APIGatewayProxyEventQueryStringParameters;

  const queryValidation = querySchema.safeParse(queryParams);
  if (!queryValidation.success) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: queryValidation.error.errors[0]?.message || `Invalid query string parameter 'type'`,
      }),
    };
  }

  const { type: campaignType } = queryValidation.data;

  let campaignData: CampaignEvent[];
  try {
    const validatedCampaigns = campaigns.map((campaign) => {
      const campaignTypeEnum = Object.values(CampaignType).find((type) => type === campaign.campaignType);

      if (!campaignTypeEnum) {
        throw new Error(`Invalid campaign type: ${campaign.campaignType}`);
      }

      return {
        ...campaign,
        campaignType: campaignTypeEnum,
      };
    });

    campaignData = mapCampaignData(validatedCampaigns);

    const campaignDataValidation = CampaignEventsSchema.safeParse(campaignData);
    if (!campaignDataValidation.success) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          message: 'Invalid campaign data format',
          errors: campaignDataValidation.error.errors,
        }),
      };
    }

    campaignData = campaignDataValidation.data;
  } catch (error) {
    logger.error({ message: `Error in mapping campaign data: ${JSON.stringify(error)}` });
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Error in campaign data',
      }),
    };
  }

  const activeCampaigns = getActiveCampaigns(campaignType, campaignData);

  return {
    statusCode: 200,
    body: JSON.stringify({
      data: activeCampaigns,
    }),
  };
};
