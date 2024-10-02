import { APIGatewayEvent } from 'aws-lambda';

import * as MapCampaignHelper from '../../../helpers/mapCampaignData';
import { CampaignType } from '../../services/campaigns';

import { handler } from './getActiveCampaigns';

describe('getActiveCampaigns Handler', () => {
  const mockEvent: Partial<APIGatewayEvent> = {
    queryStringParameters: {
      type: CampaignType.ThankYouCampaign,
    },
  };
  it('should return response from getActiveCampaigns service when a type is passed', async () => {
    const expectedCampaignData = [
      {
        id: 'testerCampaign',
        campaignType: CampaignType.ThankYouCampaign,
        content: {
          imageURL: 'https://cdn.bluelightcard.co.uk/big-rewards-2024-1.jpg',
          iframeURL: 'https://campaign.odicci.com/#/2031feeae3808e7b8802',
        },
        startDate: '2024-09-02T00:00:00Z',
        endDate: '2024-09-06T23:59:59.997Z',
      },
    ];

    const getActiveCampaignsSpy = jest.spyOn(MapCampaignHelper, 'mapCampaignData').mockImplementation(() => []);

    const expectedResponse = {
      statusCode: 200,
      body: JSON.stringify({ data: [] }),
    };

    const results = await handler(mockEvent as APIGatewayEvent);

    expect(results.statusCode).toEqual(200);
    expect(results.body).toEqual(expectedResponse.body);

    expect(getActiveCampaignsSpy).toHaveBeenCalledWith(expect.arrayContaining(expectedCampaignData));
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

  it('should return 400 when an invalid query string parameter is provided', async () => {
    const invalidMockEvent: Partial<APIGatewayEvent> = {
      queryStringParameters: {
        type: 'InvalidCampaign',
      },
    };

    const results = await handler(invalidMockEvent as APIGatewayEvent);

    expect(results.statusCode).toEqual(400);
    expect(results.body).toEqual(
      JSON.stringify({
        message: "Invalid enum value. Expected 'thankyouCampaign' | 'blackFriday', received 'InvalidCampaign'",
      }),
    );
  });
});
