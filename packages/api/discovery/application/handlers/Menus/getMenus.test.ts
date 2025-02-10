import { APIGatewayEvent } from 'aws-lambda';

import { Response } from '@blc-mono/core/utils/restResponse/response';
import * as JWTUtils from '@blc-mono/core/utils/unpackJWT';
import { JWT } from '@blc-mono/core/utils/unpackJWT';
import { isValidMenu } from '@blc-mono/discovery/application/utils/isValidMenu';
import { isValidMenuOffer } from '@blc-mono/discovery/application/utils/isValidMenuOffer';

import { menuFactory } from '../../factories/MenuFactory';
import { menuOfferFactory } from '../../factories/MenuOfferFactory';
import { subMenuFactory } from '../../factories/SubMenuFactory';
import { MenuWithOffers, MenuWithSubMenus } from '../../models/Menu';
import { MenuType } from '../../models/MenuResponse';
import { mapMenusAndOffersToMenuResponse } from '../../repositories/Menu/service/mapper/MenuMapper';
import { getMenusByMenuType } from '../../repositories/Menu/service/MenuService';
import * as UserDetails from '../../utils/getUserDetails';
import { getUserInHandlersSharedTests } from '../getUserInHandlersTests';

import { handler } from './getMenus';

jest.mock('../../services/opensearch/DiscoveryOpenSearchService');
jest.mock('@blc-mono/core/utils/getEnv');
jest.mock('@blc-mono/core/utils/unpackJWT');
jest.mock('../../repositories/Menu/service/MenuService');
jest.mock('@blc-mono/discovery/application/utils/isValidMenuOffer');
jest.mock('@blc-mono/discovery/application/utils/isValidMenu');

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
const isValidMenuOfferMock = jest.mocked(isValidMenuOffer);
const isValidMenuMock = jest.mocked(isValidMenu);

const dealsOfTheWeekMock: MenuWithOffers[] = [
  {
    ...menuFactory.build({ menuType: MenuType.DEALS_OF_THE_WEEK }),
    offers: menuOfferFactory.buildList(2),
  },
];

const featuredMock: MenuWithOffers[] = [
  { ...menuFactory.build({ menuType: MenuType.FEATURED }), offers: menuOfferFactory.buildList(2) },
];

const marketplaceMock: MenuWithOffers[] = [
  { ...menuFactory.build({ menuType: MenuType.MARKETPLACE }), offers: menuOfferFactory.buildList(2) },
  { ...menuFactory.build({ menuType: MenuType.MARKETPLACE }), offers: menuOfferFactory.buildList(2) },
];

const flexibleMock: MenuWithSubMenus[] = [
  { ...menuFactory.build({ menuType: MenuType.FLEXIBLE }), subMenus: subMenuFactory.buildList(2) },
  { ...menuFactory.build({ menuType: MenuType.FLEXIBLE }), subMenus: subMenuFactory.buildList(2) },
];

describe('getMenus handler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    isValidMenuOfferMock.mockReturnValue(true);
    jest.spyOn(UserDetails, 'getUserDetails').mockResolvedValue({ dob: '2001-01-01', organisation: 'DEN' });

    jest.spyOn(JWTUtils, 'unpackJWT').mockImplementation(() => mockStandardToken);
  });
  it('should call the getMenusByMenuType for all menu types when no ids are provided', async () => {
    getMenusByMenuTypeMock.mockResolvedValue([]);

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
      data: {},
    });

    expect(result).toEqual(expectedResponse);
    expect(getMenusByMenuTypeMock).toHaveBeenCalledTimes(4);
  });

  describe('and menus are found', () => {
    beforeEach(() => {
      getMenusByMenuTypeMock.mockImplementation((menuType: MenuType) => {
        switch (menuType) {
          case MenuType.DEALS_OF_THE_WEEK:
            return Promise.resolve(dealsOfTheWeekMock);
          case MenuType.FEATURED:
            return Promise.resolve(featuredMock);
          case MenuType.MARKETPLACE:
            return Promise.resolve(marketplaceMock);
          case MenuType.FLEXIBLE:
            return Promise.resolve(flexibleMock);
          default:
            return Promise.resolve([]);
        }
      });
    });

    const event: Partial<APIGatewayEvent> = {
      queryStringParameters: {},
      headers: {
        Authorization: 'idToken',
        'x-client-type': 'web',
      },
    };

    it('should filter out the menu if no valid offers', async () => {
      isValidMenuOfferMock.mockReturnValue(false);
      isValidMenuMock.mockReturnValue(true);

      const result = await handler(event as APIGatewayEvent);

      const expectedResponse = Response.OK({
        message: 'successful',
        data: mapMenusAndOffersToMenuResponse({
          dealsOfTheWeek: [],
          marketplace: [],
          flexible: flexibleMock,
        }),
      });
      expect(result).toEqual(expectedResponse);
    });

    it('should filter out invalid offers', async () => {
      isValidMenuOfferMock.mockReturnValueOnce(false);
      isValidMenuOfferMock.mockReturnValue(true);
      const dealsOfTheWeekEvent: Partial<APIGatewayEvent> = {
        queryStringParameters: {
          id: 'dealsOfTheWeek',
        },
        headers: {
          Authorization: 'idToken',
          'x-client-type': 'web',
        },
      };

      const result = await handler(dealsOfTheWeekEvent as APIGatewayEvent);

      const expectedResponse = Response.OK({
        message: 'successful',
        data: mapMenusAndOffersToMenuResponse({
          dealsOfTheWeek: [
            {
              ...dealsOfTheWeekMock[0],
              offers: [dealsOfTheWeekMock[0].offers[1]],
            },
          ],
        }),
      });
      expect(result).toEqual(expectedResponse);
      expect(isValidMenuOfferMock).toHaveBeenCalledTimes(2);
    });

    it('should filter out invalid menus', async () => {
      isValidMenuMock.mockReturnValue(false);
      const dealsOfTheWeekEvent: Partial<APIGatewayEvent> = {
        queryStringParameters: {
          id: 'dealsOfTheWeek',
        },
        headers: {
          Authorization: 'idToken',
          'x-client-type': 'web',
        },
      };

      const result = await handler(dealsOfTheWeekEvent as APIGatewayEvent);

      const expectedResponse = Response.OK({
        message: 'successful',
        data: mapMenusAndOffersToMenuResponse({
          dealsOfTheWeek: [],
        }),
      });
      expect(result).toEqual(expectedResponse);
    });
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
