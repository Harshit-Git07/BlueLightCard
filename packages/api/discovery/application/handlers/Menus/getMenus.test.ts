import { APIGatewayEvent } from 'aws-lambda';

import { Response } from '@blc-mono/core/utils/restResponse/response';
import { MenuResponse } from '@blc-mono/discovery/application/models/MenuResponse';

import { dummyMenuResponse, handler } from './getMenus';

describe('getMenus handler', () => {
  it('should return the full menu response when no ids are provided', async () => {
    const event: Partial<APIGatewayEvent> = {
      queryStringParameters: {},
      headers: {
        Authorization: 'idToken',
      },
    };

    const result = await handler(event as APIGatewayEvent);

    const expectedResponse = Response.OK({
      message: 'successful',
      data: dummyMenuResponse,
    });

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
      dealsOfTheWeek: dummyMenuResponse.dealsOfTheWeek,
      featured: dummyMenuResponse.featured,
    };

    const expectedResponse = Response.OK({
      message: 'successful',
      data: menuResponse,
    });

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

    const expectedResponse = Response.BadRequest({
      message: `error`,
      data: 'Error querying getMenus',
    });

    expect(result).toEqual(expectedResponse);
  });
});
