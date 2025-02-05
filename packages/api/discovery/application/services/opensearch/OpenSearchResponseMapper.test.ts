import { mapToNearestOfferSearchResult, NearestOffersSearchResponse } from './OpenSearchResponseMapper';

describe('OpenSearchResponseMapper', () => {
  describe('mapToNearestOfferSearchResult', () => {
    const baseMockLocationResult: NearestOffersSearchResponse = {
      hits: {
        hits: [
          {
            _source: {
              company_id: 'mockCompanyID',
              company_name: 'mockCompanyName',
              company_small_logo: 'mockCompanyLogo',
              excluded_trusts: [],
              included_trusts: [],
              offer_id: 'mockOfferId',
              legacy_company_id: 1,
            },
            inner_hits: {
              company_locations: {
                hits: {
                  hits: [
                    {
                      _source: {
                        geo_point: {
                          lat: 51.5074,
                          lon: -0.1278,
                        },
                        location_id: 'mockLocationId',
                        store_name: 'mockStoreName',
                      },
                      fields: {
                        distance: [30],
                      },
                    },
                  ],
                },
              },
            },
          },
          {
            _source: {
              company_id: 'mockCompanyID',
              company_name: 'mockCompanyName',
              company_small_logo: 'mockCompanyLogo',
              excluded_trusts: [],
              included_trusts: [],
              offer_id: 'mockOfferId2',
              legacy_company_id: 1,
            },
            inner_hits: {
              company_locations: {
                hits: {
                  hits: [
                    {
                      _source: {
                        geo_point: {
                          lat: 51.5074,
                          lon: -0.1278,
                        },
                        location_id: 'mockLocationId',
                        store_name: 'mockStoreName',
                      },
                      fields: {
                        distance: [30],
                      },
                    },
                  ],
                },
              },
            },
          },
          {
            _source: {
              company_id: 'mockCompany2ID',
              company_name: 'mockCompany2Name',
              company_small_logo: 'mockCompany2Logo',
              excluded_trusts: [],
              included_trusts: [],
              offer_id: 'mockOfferId3',
              legacy_company_id: 1,
            },
            inner_hits: {
              company_locations: {
                hits: {
                  hits: [
                    {
                      _source: {
                        geo_point: {
                          lat: 51.5074,
                          lon: -0.1278,
                        },
                        location_id: 'mockLocation2Id',
                        store_name: 'mockStoreName2',
                      },
                      fields: {
                        distance: [10],
                      },
                    },
                    {
                      _source: {
                        geo_point: {
                          lat: 51.5074,
                          lon: -0.1278,
                        },
                        location_id: 'mockLocation3Id',
                        store_name: 'mockStoreName3',
                      },
                      fields: {
                        distance: [0],
                      },
                    },
                  ],
                },
              },
            },
          },
        ],
      },
    };
    it('should map the response to the expected format, creating a unique set of locations sorted by distance', () => {
      const result = mapToNearestOfferSearchResult(baseMockLocationResult);
      expect(result).toStrictEqual([
        {
          locationId: 'mockLocation3Id',
          lon: -0.1278,
          lat: 51.5074,
          distance: 0,
          storeName: 'mockStoreName3',
          companyLogo: 'mockCompany2Logo',
          companyName: 'mockCompany2Name',
          legacyCompanyId: 1,
          companyId: 'mockCompany2ID',
          excludedTrusts: [],
          includedTrusts: [],
        },
        {
          locationId: 'mockLocation2Id',
          companyLogo: 'mockCompany2Logo',
          companyName: 'mockCompany2Name',
          lon: -0.1278,
          lat: 51.5074,
          distance: 10,
          storeName: 'mockStoreName2',
          legacyCompanyId: 1,
          companyId: 'mockCompany2ID',
          excludedTrusts: [],
          includedTrusts: [],
        },
        {
          locationId: 'mockLocationId',
          companyLogo: 'mockCompanyLogo',
          companyName: 'mockCompanyName',
          lon: -0.1278,
          lat: 51.5074,
          distance: 30,
          storeName: 'mockStoreName',
          legacyCompanyId: 1,
          companyId: 'mockCompanyID',
          excludedTrusts: [],
          includedTrusts: [],
        },
      ]);
    });
  });
});
