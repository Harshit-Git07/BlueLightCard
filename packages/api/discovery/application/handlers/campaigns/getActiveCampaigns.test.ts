import { APIGatewayEvent } from 'aws-lambda';

import * as MapCampaignHelper from '../../../helpers/mapCampaignData';
import { CampaignType } from '../../services/campaigns';
import * as campaignsService from '../../services/campaigns';

import { handler } from './getActiveCampaigns';

describe('getActiveCampaigns Handler', () => {
  const getActiveCampaignsSpy = jest.spyOn(campaignsService, 'getActiveCampaigns').mockImplementation(() => []);
  const mockEvent: Partial<APIGatewayEvent> = {
    queryStringParameters: {
      type: CampaignType.BlackFriday,
    },
  };

  it('should return response from getActiveCampaigns service when a type is passed', async () => {
    const expectedResponse = {
      statusCode: 200,
      body: JSON.stringify({
        data: [],
      }),
    };

    const results = await handler(mockEvent as APIGatewayEvent);

    expect(results.statusCode).toEqual(200);
    expect(results).toEqual(expectedResponse);
    expect(getActiveCampaignsSpy).toHaveBeenCalledWith(CampaignType.BlackFriday, expect.any(Array));
  });

  it('should return a 400 if no campaignType is passed', async () => {
    const mockEvent: Partial<APIGatewayEvent> = {
      queryStringParameters: {
        type: undefined,
      },
    };
    const expectedResponse = {
      statusCode: 400,
      body: JSON.stringify({
        message: `Missing query string parameter 'type'`,
      }),
    };

    const results = await handler(mockEvent as APIGatewayEvent);

    expect(results).toEqual(expectedResponse);
  });

  it('should return a 500 if an error is thrown whilst mapping the campaign data', async () => {
    const mapCampaignDataSpy = jest.spyOn(MapCampaignHelper, 'mapCampaignData').mockImplementation(() => {
      throw new Error('Error in campaign data');
    });
    const results = await handler(mockEvent as APIGatewayEvent);

    expect(mapCampaignDataSpy).toHaveBeenCalled();
    expect(results.statusCode).toEqual(500);
    expect(results.body).toEqual(JSON.stringify({ message: 'Error in campaign data' }));
  });
});
