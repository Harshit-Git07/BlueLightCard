import { Logger } from '@aws-lambda-powertools/logger';
import { isEqual } from 'lodash';

import * as getEnv from '@blc-mono/core/utils/getEnv';
import { mapOfferToOpenSearchBody, OpenSearchBody } from '@blc-mono/discovery/application/models/OpenSearchType';
import * as OffersService from '@blc-mono/discovery/application/repositories/Offer/service/OfferService';
import { OpenSearchService } from '@blc-mono/discovery/application/services/OpenSearchService';
import { DiscoveryStackEnvironmentKeys } from '@blc-mono/discovery/infrastructure/constants/environment';

import { offerFactory } from '../../factories/OfferFactory';
import { Offer } from '../../models/Offer';

import { handler } from './populateSearchIndex';

jest.mock('@blc-mono/discovery/application/repositories/Offer/service/OfferService');
jest.mock('@blc-mono/discovery/application/services/OpenSearchService');
jest.mock('@aws-lambda-powertools/logger');
jest.mock('@blc-mono/core/utils/getEnv');

describe('populateSearchIndex', () => {
  beforeEach(() => {
    jest.spyOn(getEnv, 'getEnv').mockImplementation((name: string) => {
      switch (name) {
        case DiscoveryStackEnvironmentKeys.REGION:
          return 'eu-west-2';
        case DiscoveryStackEnvironmentKeys.SERVICE:
          return 'mockIndex';
        case DiscoveryStackEnvironmentKeys.STAGE:
          return 'mockEnvironment';
        default:
          return 'unset variable';
      }
    });
  });

  it('should log an error if no offers are found', async () => {
    const loggerError = jest.spyOn(Logger.prototype, 'error');
    jest.spyOn(OffersService, 'getNonLocalOffers').mockResolvedValue([]);

    await handler();
    expect(loggerError).toHaveBeenCalledWith('No offers or companies found in dynamoDB');
  });

  it('should log an error if an exception occurs', async () => {
    const error = new Error('Test error');
    const mockOffers = offerFactory.buildList(1);
    const loggerError = jest.spyOn(Logger.prototype, 'error');

    jest.spyOn(OffersService, 'getNonLocalOffers').mockResolvedValue(mockOffers);
    jest.spyOn(OpenSearchService.prototype, 'addDocumentsToIndex').mockRejectedValue(error);

    await handler();
    expect(loggerError).toHaveBeenCalledWith('Error building search index', JSON.stringify(error));
  });

  it('should convert offers to OpenSearch format and add to index', async () => {
    const addMultipleDocumentsToIndex = jest
      .spyOn(OpenSearchService.prototype, 'addDocumentsToIndex')
      .mockResolvedValue(undefined);
    const mockOffers = offerFactory.buildList(1);
    const getMockOffers = jest.spyOn(OffersService, 'getNonLocalOffers').mockResolvedValue(mockOffers);

    await handler();
    expect(getMockOffers).toHaveBeenCalled();
    expect(addMultipleDocumentsToIndex).toHaveBeenCalled();
  });

  it('should map an offer to OpenSearchType correctly', () => {
    const TODAY = new Date().toISOString();
    const TOMORROW = new Date(Date.now() + 86400000).toISOString();
    const ONE_HOUR_LATER = new Date(Date.now() + 3600000).toISOString();

    const offer: Offer = {
      id: 'offer-1',
      legacyOfferId: 1,
      name: 'Offer 1',
      status: 'active',
      offerType: 'discount',
      offerDescription: 'Description for offer 1',
      image: 'http://example.com/image1.jpg',
      offerStart: TODAY,
      offerEnd: TOMORROW,
      evergreen: false,
      tags: ['tag1', 'tag2'],
      serviceRestrictions: ['restriction1', 'restriction2'],
      company: {
        id: 'company-1',
        legacyCompanyId: 1,
        name: 'Company 1',
        logo: 'http://example.com/logo1.jpg',
        ageRestrictions: 'None',
        alsoKnownAs: ['Alias 1'],
        serviceRestrictions: ['restriction1', 'restriction2'],
        categories: [
          {
            id: 1,
            name: 'Category 1',
            parentCategoryIds: ['parent-1'],
            level: 1,
            updatedAt: TODAY,
          },
        ],
        local: false,
        updatedAt: TODAY,
      },
      categories: [
        {
          id: 1,
          name: 'Category 1',
          parentCategoryIds: ['parent-1'],
          level: 1,
          updatedAt: TODAY,
        },
      ],
      local: false,
      discount: {
        coverage: '100',
        type: 'percentage',
        description: 'mock discount description 1',
        updatedAt: '2022-01-01T00:00:00Z',
      },
      commonExclusions: ['exclusion1', 'exclusion2'],
      boost: {
        type: 'temporary',
        boostStart: TODAY,
        boostEnd: ONE_HOUR_LATER,
        updatedAt: TODAY,
      },
      updatedAt: TODAY,
    };

    const expectedOpenSearchType: OpenSearchBody = {
      offer_id: 'offer-1',
      offer_name: 'Offer 1',
      offer_status: 'active',
      offer_type: 'discount',
      offer_description: 'Description for offer 1',
      offer_description_stripped: 'Description for offer 1',
      offer_image: 'http://example.com/image1.jpg',
      offer_start: offer.offerStart ?? '',
      offer_expires: offer.offerEnd ?? '',
      offer_tags: ['tag1', 'tag2'],
      company_id: 'company-1',
      company_name: 'Company 1',
      company_name_stripped: 'Company 1',
      company_small_logo: 'http://example.com/logo1.jpg',
      company_tags: ['Alias 1'],
      is_age_gated: 'None',
      restricted_to: ['restriction1', 'restriction2'],
      category_name: 'Category 1',
      new_category_1: 'Category 1',
      category_level_2: '',
      category_level_3: '',
      category_level_4: '',
      date_offer_last_updated: offer.updatedAt,
    };

    const result = mapOfferToOpenSearchBody(offer);

    expect(isEqual(result, expectedOpenSearchType)).toBe(true);
  });
});
