import { NearestOfferSearchResultResponse } from '@blc-mono/discovery/application/services/opensearch/OpenSearchResponseMapper';

import { whenNearestOffersIsCalledWith } from '../../helpers';

type NearestOffersOpenSearchTestInput = {
  companyLocation: {
    lat: number;
    lon: number;
  };
  storeName: string;
  companyUUID: string;
  companyName: string;
  testUserToken: string;
};

export function nearestOpenSearchTests({
  testUserToken,
  companyUUID,
  companyLocation,
  companyName,
  storeName,
}: NearestOffersOpenSearchTestInput) {
  it('should return the nearest offers', async () => {
    const queryParams = {
      lon: companyLocation.lon.toString(),
      lat: companyLocation.lat.toString(),
      distance: '10',
      limit: '10',
      distanceUnit: 'mi',
    };

    const response = await whenNearestOffersIsCalledWith({ Authorization: testUserToken }, queryParams);
    const results = (await response.json()) as { data: NearestOfferSearchResultResponse[] };

    const searchResult = results.data.find((result) => result.companyId === companyUUID);

    expect(searchResult).toBeDefined();
    expect(searchResult).toStrictEqual({
      companyId: companyUUID,
      companyLogo: 'https://testimage.com',
      legacyCompanyId: 1,
      companyName,
      distance: 0,
      lat: companyLocation.lat,
      lon: companyLocation.lon,
      locationId: expect.any(String),
      storeName,
    });
    expect(searchResult?.locationId).toContain(companyUUID);
  });

  it('should return the company when searched with company name', async () => {
    const queryParams = {
      lon: companyLocation.lon.toString(),
      lat: companyLocation.lat.toString(),
      distance: '10',
      companyName,
      limit: '10',
      distanceUnit: 'km',
    };
    const response = await whenNearestOffersIsCalledWith({ Authorization: testUserToken }, queryParams);
    const results = (await response.json()) as { data: NearestOfferSearchResultResponse[] };

    const searchResult = results.data.find((result) => result.companyId === companyUUID);
    expect(searchResult).toBeDefined();
    expect(searchResult).toStrictEqual({
      companyId: companyUUID,
      companyLogo: 'https://testimage.com',
      legacyCompanyId: 1,
      companyName,
      distance: 0,
      lat: companyLocation.lat,
      lon: companyLocation.lon,
      locationId: expect.any(String),
      storeName,
    });
  });

  it('should return the company when searched with company id', async () => {
    const queryParams = {
      lon: companyLocation.lon.toString(),
      lat: companyLocation.lat.toString(),
      distance: '10',
      companyId: companyUUID,
      limit: '10',
      distanceUnit: 'km',
    };
    const response = await whenNearestOffersIsCalledWith({ Authorization: testUserToken }, queryParams);
    const results = (await response.json()) as { data: NearestOfferSearchResultResponse[] };

    const searchResult = results.data.find((result) => result.companyId === companyUUID);
    expect(searchResult).toBeDefined();
    expect(searchResult).toStrictEqual({
      companyId: companyUUID,
      companyLogo: 'https://testimage.com',
      legacyCompanyId: 1,
      companyName,
      distance: 0,
      lat: companyLocation.lat,
      lon: companyLocation.lon,
      locationId: expect.any(String),
      storeName,
    });
  });

  it('should not return the location if the company id is not found', async () => {
    const queryParams = {
      lon: companyLocation.lon.toString(),
      lat: companyLocation.lat.toString(),
      distance: '10',
      companyId: 'invalid-company-id',
      limit: '10',
      distanceUnit: 'km',
    };
    const response = await whenNearestOffersIsCalledWith({ Authorization: testUserToken }, queryParams);
    const results = (await response.json()) as { data: NearestOfferSearchResultResponse[] };

    const searchResult = results.data;
    expect(searchResult).toStrictEqual([]);
  });

  it('should not return the location if it is not in the range', async () => {
    const queryParams = {
      lon: (companyLocation.lon + 10).toString(),
      lat: (companyLocation.lat + 10).toString(),
      distance: '1',
      limit: '10',
      distanceUnit: 'km',
    };
    const response = await whenNearestOffersIsCalledWith({ Authorization: testUserToken }, queryParams);
    const results = (await response.json()) as { data: NearestOfferSearchResultResponse[] };

    const searchResult = results.data;
    expect(searchResult).toStrictEqual([]);
  });
}
