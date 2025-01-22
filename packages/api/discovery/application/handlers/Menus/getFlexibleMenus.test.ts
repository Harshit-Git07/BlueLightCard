import { APIGatewayEvent } from 'aws-lambda';

import { HttpStatusCode } from '@blc-mono/core/types/http-status-code.enum';
import { Response } from '@blc-mono/core/utils/restResponse/response';
import * as JWTUtils from '@blc-mono/core/utils/unpackJWT';
import { JWT } from '@blc-mono/core/utils/unpackJWT';
import { isValidEvent, isValidOffer } from '@blc-mono/discovery/application/utils/isValidOffer';

import { eventFactory, offerFactory } from '../../factories/OfferFactory';
import { subMenuFactory } from '../../factories/SubMenuFactory';
import { ThemedSubMenuWithOffers } from '../../models/ThemedMenu';
import { mapThemedSubMenuWithOffersToFlexibleMenuResponse } from '../../repositories/Menu/service/mapper/FlexibleMenuMapper';
import { getThemedMenuAndOffersBySubMenuId } from '../../repositories/Menu/service/MenuService';
import * as UserDetails from '../../utils/getUserDetails';
import { getUserInHandlersSharedTests } from '../getUserInHandlersTests';

import { handler } from './getFlexibleMenus';

jest.mock('../../services/opensearch/DiscoveryOpenSearchService');
jest.mock('@blc-mono/core/utils/getEnv');
jest.mock('@blc-mono/core/utils/unpackJWT');
jest.mock('../../repositories/Menu/service/MenuService');
jest.mock('@blc-mono/discovery/application/utils/isValidOffer');
jest.mock('../../utils/getUserDetails');

const mockStandardToken: JWT = {
  sub: '123456',
  exp: 9999999999,
  iss: 'https://example.com/',
  iat: 999999999,
  email: 'user@example.com',
  'custom:blc_old_uuid': 'legacy-uuid',
  'custom:blc_old_id': '1234',
};

const getThemedMenuAndOffersBySubMenuIdMock = jest.mocked(getThemedMenuAndOffersBySubMenuId);
const isValidOfferMock = jest.mocked(isValidOffer);
const isValidEventMock = jest.mocked(isValidEvent);

const subMenu = subMenuFactory.build();
const offers = offerFactory.buildList(2);
const events = eventFactory.buildList(2);

const mockGetOfferFlexibleMenusResponse: ThemedSubMenuWithOffers = { ...subMenu, offers, events: [] };
const mockGetEventFlexibleMenusResponse: ThemedSubMenuWithOffers = { ...subMenu, offers: [], events };

describe('getFlexibleMenus handler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    isValidOfferMock.mockReturnValue(true);
    isValidEventMock.mockReturnValue(true);
    jest.spyOn(UserDetails, 'getUserDetails').mockResolvedValue({ dob: '2001-01-01', organisation: 'DEN' });
    jest.spyOn(JWTUtils, 'unpackJWT').mockImplementation(() => mockStandardToken);
  });

  describe('and menu is found', () => {
    const event: Partial<APIGatewayEvent> = {
      pathParameters: {
        id: 'id',
      },
      headers: {
        Authorization: 'idToken',
        'x-client-type': 'web',
      },
    };

    it('should return the response when a valid id is provided and the menu is found', async () => {
      getThemedMenuAndOffersBySubMenuIdMock.mockResolvedValue(mockGetOfferFlexibleMenusResponse);

      const result = await handler(event as APIGatewayEvent);

      const expectedResponse = Response.OK({
        message: 'successful',
        data: mapThemedSubMenuWithOffersToFlexibleMenuResponse(mockGetOfferFlexibleMenusResponse),
      });
      expect(result).toEqual(expectedResponse);
      expect(getThemedMenuAndOffersBySubMenuIdMock).toHaveBeenCalled();
    });

    it('should return the response event menu when a valid id is provided and the menu is found', async () => {
      getThemedMenuAndOffersBySubMenuIdMock.mockResolvedValue(mockGetEventFlexibleMenusResponse);

      const result = await handler(event as APIGatewayEvent);
      const expectedResponse = Response.OK({
        message: 'successful',
        data: mapThemedSubMenuWithOffersToFlexibleMenuResponse(mockGetEventFlexibleMenusResponse),
      });

      expect(result).toEqual(expectedResponse);
      expect(getThemedMenuAndOffersBySubMenuIdMock).toHaveBeenCalled();
    });

    it('should filter out invalid events', async () => {
      getThemedMenuAndOffersBySubMenuIdMock.mockResolvedValue(mockGetEventFlexibleMenusResponse);

      isValidEventMock.mockReturnValueOnce(false);
      isValidEventMock.mockReturnValue(true);

      const result = await handler(event as APIGatewayEvent);

      const expectedResponse = Response.OK({
        message: 'successful',
        data: mapThemedSubMenuWithOffersToFlexibleMenuResponse({
          ...mockGetEventFlexibleMenusResponse,
          events: [events[1]],
        }),
      });
      expect(result).toEqual(expectedResponse);
      expect(isValidEventMock).toHaveBeenCalledTimes(2);
    });

    it('should filter out invalid offers', async () => {
      getThemedMenuAndOffersBySubMenuIdMock.mockResolvedValue(mockGetOfferFlexibleMenusResponse);

      isValidOfferMock.mockReturnValueOnce(false);
      isValidOfferMock.mockReturnValue(true);

      const result = await handler(event as APIGatewayEvent);

      const expectedResponse = Response.OK({
        message: 'successful',
        data: mapThemedSubMenuWithOffersToFlexibleMenuResponse({
          ...mockGetOfferFlexibleMenusResponse,
          offers: [offers[1]],
        }),
      });
      expect(result).toEqual(expectedResponse);
      expect(isValidOfferMock).toHaveBeenCalledTimes(2);
    });
  });

  it('should return a not found response when a valid id is provided and the menu is not found', async () => {
    getThemedMenuAndOffersBySubMenuIdMock.mockResolvedValue(undefined);
    const event: Partial<APIGatewayEvent> = {
      pathParameters: {
        id: 'id',
      },
      headers: {
        Authorization: 'idToken',
        'x-client-type': 'web',
      },
    };
    const result = await handler(event as APIGatewayEvent);
    const expectedResponse = Response.NotFound({ message: `No flexible menu found with id: id` });
    expect(result).toEqual(expectedResponse);
  });

  it('should return a bad request response when an invalid id is provided', async () => {
    const event: Partial<APIGatewayEvent> = {
      pathParameters: {},
      headers: {
        Authorization: 'idToken',
        'x-client-type': 'web',
      },
    };
    const result = await handler(event as APIGatewayEvent);
    const expectedResponse = Response.Error(
      new Error('Error querying getFlexibleMenus'),
      HttpStatusCode.INTERNAL_SERVER_ERROR,
    );
    expect(result).toEqual(expectedResponse);
  });

  it('should return a bad request if getThemedMenusAndOffersBySubMenuId throws an error', async () => {
    getThemedMenuAndOffersBySubMenuIdMock.mockRejectedValue(new Error('error'));
    const event: Partial<APIGatewayEvent> = {
      pathParameters: {
        id: 'id',
      },
      headers: {
        Authorization: 'idToken',
        'x-client-type': 'web',
      },
    };
    const result = await handler(event as APIGatewayEvent);
    const expectedResponse = Response.Error(
      new Error('Error querying getFlexibleMenus'),
      HttpStatusCode.INTERNAL_SERVER_ERROR,
    );
    expect(result).toEqual(expectedResponse);
  });

  const userTestProps = {
    handler,
    event: {
      pathParameters: {
        id: 'id',
      },
    },
    errorMessage: 'Error querying getFlexibleMenus',
    noOrganisation: {
      responseMessage: 'No organisaton assigned on user, defaulting to no menus',
      data: [],
    },
  };

  getUserInHandlersSharedTests(userTestProps);
});
