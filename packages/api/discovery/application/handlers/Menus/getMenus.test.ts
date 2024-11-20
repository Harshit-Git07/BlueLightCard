import { APIGatewayEvent } from 'aws-lambda';

import { Response } from '@blc-mono/core/utils/restResponse/response';

import { menuFactory } from '../../factories/MenuFactory';
import { offerFactory } from '../../factories/OfferFactory';
import { subMenuFactory } from '../../factories/SubMenuFactory';
import { MenuType } from '../../models/MenuResponse';
import { mapMenusAndOffersToMenuResponse } from '../../repositories/Menu/service/mapper/MenuMapper';
import { getMenusByMenuType, getMenusByMenuTypes } from '../../repositories/Menu/service/MenuService';

import { handler } from './getMenus';

jest.mock('../../repositories/Menu/service/MenuService');

const getMenusByMenuTypeMock = jest.mocked(getMenusByMenuType);
const getMenusByMenuTypesMock = jest.mocked(getMenusByMenuTypes);

const mockgetMenusResponse = {
  dealsOfTheWeek: [
    {
      ...menuFactory.build({ menuType: MenuType.DEALS_OF_THE_WEEK }),
      offers: offerFactory.buildList(2),
    },
  ],
  featured: [{ ...menuFactory.build({ menuType: MenuType.FEATURED }), offers: offerFactory.buildList(2) }],
  marketplace: [
    { ...menuFactory.build({ menuType: MenuType.MARKETPLACE }), offers: offerFactory.buildList(2) },
    { ...menuFactory.build({ menuType: MenuType.MARKETPLACE }), offers: offerFactory.buildList(2) },
  ],
  flexible: [
    { ...menuFactory.build({ menuType: MenuType.FLEXIBLE }), subMenus: subMenuFactory.buildList(2) },
    { ...menuFactory.build({ menuType: MenuType.FLEXIBLE }), subMenus: subMenuFactory.buildList(2) },
  ],
};

describe('getMenus handler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('should call the getMenusByMenuTypes when no ids are provided', async () => {
    getMenusByMenuTypesMock.mockResolvedValue(mockgetMenusResponse);

    const event: Partial<APIGatewayEvent> = {
      queryStringParameters: {},
      headers: {
        Authorization: 'idToken',
      },
    };

    const result = await handler(event as APIGatewayEvent);

    const expectedResponse = Response.OK({
      message: 'successful',
      data: mapMenusAndOffersToMenuResponse(mockgetMenusResponse),
    });

    expect(result).toEqual(expectedResponse);
    expect(getMenusByMenuTypesMock).toHaveBeenCalled();
    expect(getMenusByMenuTypeMock).not.toHaveBeenCalled();
  });

  it('should call the getMenusByMenuTypes when more than one id is provided', async () => {
    const filteredMenuReponse = {
      dealsOfTheWeek: mockgetMenusResponse.dealsOfTheWeek,
      featured: mockgetMenusResponse.featured,
    };

    getMenusByMenuTypesMock.mockResolvedValue(filteredMenuReponse);

    const event: Partial<APIGatewayEvent> = {
      queryStringParameters: {
        id: 'dealsOfTheWeek,featured',
      },
      headers: {
        Authorization: 'idToken',
      },
    };

    const result = await handler(event as APIGatewayEvent);

    const expectedResponse = Response.OK({
      message: 'successful',
      data: mapMenusAndOffersToMenuResponse(filteredMenuReponse),
    });

    expect(result).toEqual(expectedResponse);
    expect(getMenusByMenuTypesMock).toHaveBeenCalled();
    expect(getMenusByMenuTypeMock).not.toHaveBeenCalled();
  });

  it('should call the getMenusByMenuType if only one id is provided', async () => {
    const filteredMenuReponse = {
      dealsOfTheWeek: mockgetMenusResponse.dealsOfTheWeek,
    };
    getMenusByMenuTypeMock.mockResolvedValue(filteredMenuReponse);
    const event: Partial<APIGatewayEvent> = {
      queryStringParameters: {
        id: 'dealsOfTheWeek',
      },
      headers: {
        Authorization: 'idToken',
      },
    };

    const result = await handler(event as APIGatewayEvent);

    const expectedResponse = Response.OK({
      message: 'successful',
      data: mapMenusAndOffersToMenuResponse(filteredMenuReponse),
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
