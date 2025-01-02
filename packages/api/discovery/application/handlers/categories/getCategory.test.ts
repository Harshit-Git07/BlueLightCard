import { APIGatewayEvent } from 'aws-lambda';

import * as getEnv from '@blc-mono/core/utils/getEnv';
import { EventType, OfferType } from '@blc-mono/discovery/application/models/Offer';
import { OfferResponse } from '@blc-mono/discovery/application/models/OfferResponse';
import { DiscoveryOpenSearchService } from '@blc-mono/discovery/application/services/opensearch/DiscoveryOpenSearchService';
import { SearchResult } from '@blc-mono/discovery/application/services/opensearch/OpenSearchResponseMapper';

import { handler } from '../../../application/handlers/categories/getCategory';
import { EventResponse } from '../../models/EventResponse';

jest.mock('../../services/opensearch/DiscoveryOpenSearchService');
jest.mock('@blc-mono/core/utils/getEnv');

describe('getCategory Handler', () => {
  const expectedOffers = [buildDummyOffer(1)];
  const expectedEvent = [buildDummyEvent()];

  const offerSearchResults: SearchResult[] = [
    {
      ID: '189f3060626368d0a716f0e795d8f2c7',
      LegacyID: 9487,
      OfferName: 'Get 20% off your food bill, valid Monday - Friday = 1',
      OfferDescription: 'Offer Description',
      offerimg: 'https://cdn.sanity.io/images/td1j6hke/staging/c92d0d548e09b08e4659cb5a4a2a55fa9fc2f11c-640x320.jpg',
      CompID: '24069b9c8eb7591046d066ef57e26a94',
      LegacyCompanyID: 9694,
      CompanyName: 'Stonehouse Pizza & Carvery',
      OfferType: OfferType.IN_STORE,
    },
  ];

  const eventSearchResults: SearchResult[] = [
    {
      ID: '189f3060626368d0a716f0e795d8f2c7',
      eventName: 'Jimmy Carr event',
      eventDescription: 'event Description',
      eventImg: 'https://cdn.sanity.io/images/td1j6hke/staging/c92d0d548e09b08e4659cb5a4a2a55fa9fc2f11c-640x320.jpg',
      venueName: 'O2 arena',
      OfferType: EventType.TICKET,
      venueID: '24069b9c8eb7591046d066ef57e26a94',
    },
  ];

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    jest.spyOn(getEnv, 'getEnv').mockImplementation(() => 'example-variable');
  });

  it('should return a list of offers for a category', async () => {
    jest.spyOn(DiscoveryOpenSearchService.prototype, 'queryByCategory').mockResolvedValue(offerSearchResults);
    jest.spyOn(DiscoveryOpenSearchService.prototype, 'getLatestIndexName').mockResolvedValue('indexName');

    const result = await givenGetCategoryCalledWithCategory('1');

    thenResponseShouldEqual(
      result,
      JSON.stringify({
        message: 'Success',
        data: {
          id: '1',
          name: 'Home',
          data: expectedOffers,
        },
      }),
      200,
    );
  });

  it('should return a list of events for a category', async () => {
    jest.spyOn(DiscoveryOpenSearchService.prototype, 'queryByCategory').mockResolvedValue(eventSearchResults);
    jest.spyOn(DiscoveryOpenSearchService.prototype, 'getLatestIndexName').mockResolvedValue('indexName');

    const result = await givenGetCategoryCalledWithCategory('1');

    thenResponseShouldEqual(
      result,
      JSON.stringify({
        message: 'Success',
        data: {
          id: '1',
          name: 'Home',
          data: expectedEvent,
        },
      }),
      200,
    );
  });

  it('should return an error if invalid category id present', async () => {
    const result = await givenGetCategoryCalledWithCategory('invalid');

    thenResponseShouldEqual(
      result,
      JSON.stringify({
        message: 'Invalid category ID',
        data: {},
      }),
      400,
    );
  });

  const givenGetCategoryCalledWithCategory = async (categoryId: string) => {
    const event: Partial<APIGatewayEvent> = {
      headers: {
        Authorization: 'idToken',
      },
      pathParameters: {
        id: categoryId,
      },
    };

    return handler(event);
  };

  const thenResponseShouldEqual = (result: unknown, expectedBody: string, expectedStatusCode: number) => {
    const expectedResponse = {
      body: expectedBody,
      statusCode: expectedStatusCode,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
    };
    expect(result).toStrictEqual(expectedResponse);
  };
});

function buildDummyOffer(id: number): OfferResponse {
  return {
    offerID: '189f3060626368d0a716f0e795d8f2c7',
    legacyOfferID: 9487,
    offerName: `Get 20% off your food bill, valid Monday - Friday = ${id}`,
    offerDescription: 'Offer Description',
    offerType: OfferType.IN_STORE,
    imageURL: 'https://cdn.sanity.io/images/td1j6hke/staging/c92d0d548e09b08e4659cb5a4a2a55fa9fc2f11c-640x320.jpg',
    companyID: '24069b9c8eb7591046d066ef57e26a94',
    legacyCompanyID: 9694,
    companyName: 'Stonehouse Pizza & Carvery',
  };
}

function buildDummyEvent(): EventResponse {
  return {
    offerType: EventType.TICKET,
    eventID: '189f3060626368d0a716f0e795d8f2c7',
    eventName: `Jimmy Carr event`,
    eventDescription: 'event Description',
    imageURL: 'https://cdn.sanity.io/images/td1j6hke/staging/c92d0d548e09b08e4659cb5a4a2a55fa9fc2f11c-640x320.jpg',
    venueID: '24069b9c8eb7591046d066ef57e26a94',
    venueName: 'O2 arena',
  };
}
