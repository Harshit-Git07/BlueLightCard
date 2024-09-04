import { APIGatewayEvent } from 'aws-lambda';
import { APIGatewayProxyEventQueryStringParameters } from 'aws-lambda/trigger/api-gateway-proxy';

import { LambdaLogger } from '@blc-mono/core/utils/logger/lambdaLogger';
import { mapCampaignData } from '@blc-mono/discovery/helpers/mapCampaignData';

import campaigns from '../../../data/campaigns.json';
import { CampaignEvent, getActiveCampaigns } from '../../services/campaigns';

const logger = new LambdaLogger({ serviceName: 'getActiveCampaigns' });

export const handler = async (event: APIGatewayEvent) => {
  const queryParams = event.queryStringParameters as APIGatewayProxyEventQueryStringParameters;
  if (!queryParams?.type) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: `Missing query string parameter 'type'`,
      }),
    };
  }

  const { type: campaignType } = queryParams;
  let campaignData: CampaignEvent[];
  try {
    campaignData = mapCampaignData(campaigns);
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
