import { APIGatewayEvent } from 'aws-lambda';

import { MenuResponse } from '@blc-mono/discovery/application/models/MenuResponse';

import { handler } from '../../../application/handlers/Menus/getMenus';

describe('getMenus handler', () => {
  it('should return the full menu response when no ids are provided', async () => {
    const event: Partial<APIGatewayEvent> = {
      queryStringParameters: {},
      headers: {
        Authorization: 'idToken',
      },
    };

    const result = await handler(event as APIGatewayEvent);

    const menuResponse: MenuResponse = {
      dealsOfTheWeek: {
        offers: [
          {
            offerID: '1',
            offerName: 'Deal of the Week 1',
            offerDescription: 'Description for Deal of the Week 1',
            imageURL: 'http://example.com/image1.jpg',
            companyID: 'company1',
            companyName: 'Company 1',
          },
        ],
      },
      featured: {
        offers: [
          {
            offerID: '2',
            offerName: 'Featured Offer 1',
            offerDescription: 'Description for Featured Offer 1',
            imageURL: 'http://example.com/image2.jpg',
            companyID: 'company2',
            companyName: 'Company 2',
          },
        ],
      },
      marketplace: [
        {
          menuName: 'Marketplace Menu 1',
          hidden: false,
          offers: [
            {
              offerID: '3',
              offerName: 'Marketplace Offer 1',
              offerDescription: 'Description for Marketplace Offer 1',
              imageURL: 'http://example.com/image3.jpg',
              companyID: 'company3',
              companyName: 'Company 3',
            },
          ],
        },
      ],
      flexible: [
        {
          listID: 'list1',
          title: 'Flexible List 1',
          imageURL: 'http://example.com/image4.jpg',
        },
      ],
    };

    const expectedResponse = {
      body: JSON.stringify({ data: menuResponse }),
      statusCode: 200,
    };

    expect(result).toEqual(expectedResponse);
  });

  it('should return filtered menu response based on ids provided', async () => {
    const event: Partial<APIGatewayEvent> = {
      queryStringParameters: {
        id: 'dealsOfTheWeek,featured',
      },
      headers: {
        Authorization: 'idToken',
      },
    };

    const result = await handler(event as APIGatewayEvent);

    const menuResponse: MenuResponse = {
      dealsOfTheWeek: {
        offers: [
          {
            offerID: '1',
            offerName: 'Deal of the Week 1',
            offerDescription: 'Description for Deal of the Week 1',
            imageURL: 'http://example.com/image1.jpg',
            companyID: 'company1',
            companyName: 'Company 1',
          },
        ],
      },
      featured: {
        offers: [
          {
            offerID: '2',
            offerName: 'Featured Offer 1',
            offerDescription: 'Description for Featured Offer 1',
            imageURL: 'http://example.com/image2.jpg',
            companyID: 'company2',
            companyName: 'Company 2',
          },
        ],
      },
      marketplace: [],
      flexible: [],
    };

    const expectedResponse = {
      body: JSON.stringify({ data: menuResponse }),
      statusCode: 200,
    };

    expect(result).toEqual(expectedResponse);
  });

  it('should return error when no matching ids are provided', async () => {
    const event: Partial<APIGatewayEvent> = {
      queryStringParameters: {
        id: 'nonExistentMenu',
      },
      headers: {
        Authorization: 'idToken',
      },
    };

    const result = await handler(event as APIGatewayEvent);

    const expectedResponse = {
      body: '{"message":"Error querying getMenus"}',
      statusCode: 400,
    };
    expect(result).toEqual(expectedResponse);
  });
});
