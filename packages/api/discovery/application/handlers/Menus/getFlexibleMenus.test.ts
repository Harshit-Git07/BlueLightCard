import { APIGatewayEvent } from 'aws-lambda';

import { Response } from '@blc-mono/core/utils/restResponse/response';

import { offerFactory } from '../../factories/OfferFactory';
import { subMenuFactory } from '../../factories/SubMenuFactory';
import { ThemedSubMenuWithOffers } from '../../models/ThemedMenu';
import { mapThemedSubMenuWithOffersToFlexibleMenuResponse } from '../../repositories/Menu/service/mapper/FlexibleMenuMapper';
import { getThemedMenuAndOffersBySubMenuId } from '../../repositories/Menu/service/MenuService';

import { handler } from './getFlexibleMenus';

jest.mock('../../repositories/Menu/service/MenuService');

const getThemedMenuAndOffersBySubMenuIdMock = jest.mocked(getThemedMenuAndOffersBySubMenuId);

const subMenu = subMenuFactory.build();
const offers = offerFactory.buildList(2);

const mockGetFlexibleMenusResponse: ThemedSubMenuWithOffers = { ...subMenu, offers };

describe('getFlexibleMenus handler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return the response when a valid id is provided and the menu is found', async () => {
    getThemedMenuAndOffersBySubMenuIdMock.mockResolvedValue(mockGetFlexibleMenusResponse);

    const event: Partial<APIGatewayEvent> = {
      pathParameters: {
        id: 'id',
      },
    };
    const result = await handler(event as APIGatewayEvent);
    const expectedResponse = Response.OK({
      message: 'successful',
      data: mapThemedSubMenuWithOffersToFlexibleMenuResponse(mockGetFlexibleMenusResponse),
    });

    expect(result).toEqual(expectedResponse);
    expect(getThemedMenuAndOffersBySubMenuIdMock).toHaveBeenCalled();
  });

  it('should return a not found response when a valid id is provided and the menu is not found', async () => {
    getThemedMenuAndOffersBySubMenuIdMock.mockResolvedValue(undefined);
    const event: Partial<APIGatewayEvent> = {
      pathParameters: {
        id: 'id',
      },
    };
    const result = await handler(event as APIGatewayEvent);
    const expectedResponse = Response.NotFound({ message: `No flexible menu found with id: id` });
    expect(result).toEqual(expectedResponse);
  });

  it('should return a bad request response when an invalid id is provided', async () => {
    const event: Partial<APIGatewayEvent> = {
      pathParameters: {},
    };
    const result = await handler(event as APIGatewayEvent);
    const expectedResponse = Response.BadRequest({ message: `error`, data: 'Error querying getFlexibleMenus' });
    expect(result).toEqual(expectedResponse);
  });

  it('should return a bad request if getThemedMenusAndOffersBySubMenuId throws an error', async () => {
    getThemedMenuAndOffersBySubMenuIdMock.mockRejectedValue(new Error('error'));
    const event: Partial<APIGatewayEvent> = {
      pathParameters: {
        id: 'id',
      },
    };
    const result = await handler(event as APIGatewayEvent);
    const expectedResponse = Response.BadRequest({ message: `error`, data: 'Error querying getFlexibleMenus' });
    expect(result).toEqual(expectedResponse);
  });
});
