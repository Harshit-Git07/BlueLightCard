import { APIGatewayEvent } from 'aws-lambda';

import { Response } from '@blc-mono/core/utils/restResponse/response';
import * as JWTUtils from '@blc-mono/core/utils/unpackJWT';
import { JWT } from '@blc-mono/core/utils/unpackJWT';
import { isValidOffer } from '@blc-mono/discovery/application/utils/isValidOffer';

import { menuFactory } from '../../factories/MenuFactory';
import { offerFactory } from '../../factories/OfferFactory';
import { subMenuFactory } from '../../factories/SubMenuFactory';
import { MenuType } from '../../models/MenuResponse';
import { mapMenusAndOffersToMenuResponse } from '../../repositories/Menu/service/mapper/MenuMapper';
import { getMenusByMenuType, getMenusByMenuTypes } from '../../repositories/Menu/service/MenuService';
import * as UserDetails from '../../utils/getUserDetails';
import { getUserInHandlersSharedTests } from '../getUserInHandlersTests';

import { handler } from './getMenus';

jest.mock('../../services/opensearch/DiscoveryOpenSearchService');
jest.mock('@blc-mono/core/utils/getEnv');
jest.mock('@blc-mono/core/utils/unpackJWT');
jest.mock('../../repositories/Menu/service/MenuService');
jest.mock('@blc-mono/discovery/application/utils/isValidOffer');

const mockStandardToken: JWT = {
  sub: '123456',
  exp: 9999999999,
  iss: 'https://example.com/',
  iat: 999999999,
  email: 'user@example.com',
  'custom:blc_old_uuid': 'legacy-uuid',
  'custom:blc_old_id': '1234',
};

const getMenusByMenuTypeMock = jest.mocked(getMenusByMenuType);
const getMenusByMenuTypesMock = jest.mocked(getMenusByMenuTypes);
const isValidOfferMock = jest.mocked(isValidOffer);

const mockGetMenusResponse = {
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
const mockDealsOfTheWeekResponse = {
  ...mockGetMenusResponse,
  featured: [],
  marketplace: [],
  flexible: [],
};

describe('getMenus handler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    isValidOfferMock.mockReturnValue(true);
    jest.spyOn(UserDetails, 'getUserDetails').mockResolvedValue({ dob: '2001-01-01', organisation: 'DEN' });

    jest.spyOn(JWTUtils, 'unpackJWT').mockImplementation(() => mockStandardToken);
  });
  it('should call the getMenusByMenuTypes when no ids are provided', async () => {
    getMenusByMenuTypesMock.mockResolvedValue(mockGetMenusResponse);

    const event: Partial<APIGatewayEvent> = {
      queryStringParameters: {},
      headers: {
        Authorization: 'idToken',
        'x-client-type': 'web',
      },
    };

    const result = await handler(event as APIGatewayEvent);

    const expectedResponse = Response.OK({
      message: 'successful',
      data: mapMenusAndOffersToMenuResponse(mockGetMenusResponse),
    });

    expect(result).toEqual(expectedResponse);
    expect(getMenusByMenuTypesMock).toHaveBeenCalled();
    expect(getMenusByMenuTypeMock).not.toHaveBeenCalled();
  });

  describe('and menus are found', () => {
    beforeEach(() => {
      getMenusByMenuTypesMock.mockResolvedValue(mockDealsOfTheWeekResponse);
    });

    const event: Partial<APIGatewayEvent> = {
      queryStringParameters: {},
      headers: {
        Authorization: 'idToken',
        'x-client-type': 'web',
      },
    };

    it('should filter out the menu if no valid offers', async () => {
      isValidOfferMock.mockReturnValue(false);

      const result = await handler(event as APIGatewayEvent);

      const expectedResponse = Response.OK({
        message: 'successful',
        data: mapMenusAndOffersToMenuResponse({
          ...mockDealsOfTheWeekResponse,
          dealsOfTheWeek: [],
        }),
      });
      expect(result).toEqual(expectedResponse);
    });

    it('should filter out invalid offers', async () => {
      isValidOfferMock.mockReturnValueOnce(false);
      isValidOfferMock.mockReturnValue(true);

      const result = await handler(event as APIGatewayEvent);

      const expectedResponse = Response.OK({
        message: 'successful',
        data: mapMenusAndOffersToMenuResponse({
          ...mockDealsOfTheWeekResponse,
          dealsOfTheWeek: [
            {
              ...mockGetMenusResponse.dealsOfTheWeek[0],
              offers: [mockGetMenusResponse.dealsOfTheWeek[0].offers[1]],
            },
          ],
        }),
      });
      expect(result).toEqual(expectedResponse);
      expect(isValidOfferMock).toHaveBeenCalledTimes(2);
    });
  });

  it('should call the getMenusByMenuTypes when more than one id is provided', async () => {
    const filteredMenuReponse = {
      dealsOfTheWeek: mockGetMenusResponse.dealsOfTheWeek,
      featured: mockGetMenusResponse.featured,
    };

    getMenusByMenuTypesMock.mockResolvedValue(filteredMenuReponse);

    const event: Partial<APIGatewayEvent> = {
      queryStringParameters: {
        id: 'dealsOfTheWeek,featured',
      },
      headers: {
        Authorization: 'idToken',
        'x-client-type': 'web',
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
      dealsOfTheWeek: mockGetMenusResponse.dealsOfTheWeek,
    };
    getMenusByMenuTypeMock.mockResolvedValue(filteredMenuReponse);
    const event: Partial<APIGatewayEvent> = {
      queryStringParameters: {
        id: 'dealsOfTheWeek',
      },
      headers: {
        Authorization: 'idToken',
        'x-client-type': 'web',
      },
    };

    const result = await handler(event as APIGatewayEvent);

    const expectedResponse = Response.OK({
      message: 'successful',
      data: mapMenusAndOffersToMenuResponse(filteredMenuReponse),
    });

    expect(result).toEqual(expectedResponse);
  });

  const userTestProps = {
    handler,
    event: {},
    errorMessage: 'Error querying getMenus',
    noOrganisation: {
      responseMessage: 'No organisation assigned on user, defaulting to no offers',
      data: [],
    },
  };

  getUserInHandlersSharedTests(userTestProps);
});
