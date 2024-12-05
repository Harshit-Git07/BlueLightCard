import { Logger } from '@aws-lambda-powertools/logger';

import * as getEnv from '@blc-mono/core/utils/getEnv';
import { mapOfferToOpenSearchBody, OpenSearchBody } from '@blc-mono/discovery/application/models/OpenSearchType';
import * as OffersService from '@blc-mono/discovery/application/repositories/Offer/service/OfferService';
import { DiscoveryOpenSearchService } from '@blc-mono/discovery/application/services/opensearch/DiscoveryOpenSearchService';
import { DiscoveryStackEnvironmentKeys } from '@blc-mono/discovery/infrastructure/constants/environment';

import { offerFactory } from '../../factories/OfferFactory';
import { Offer, OfferType } from '../../models/Offer';

import { handler } from './populateSearchIndex';

jest.mock('@blc-mono/discovery/application/repositories/Offer/service/OfferService');
jest.mock('@blc-mono/discovery/application/services/opensearch/DiscoveryOpenSearchService');
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

  describe('and offers are found', () => {
    let loggerErrorSpy: jest.SpyInstance;
    const error = new Error('Test error');

    beforeEach(() => {
      const mockOffers = offerFactory.buildList(1);
      jest.spyOn(OffersService, 'getNonLocalOffers').mockResolvedValue(mockOffers);

      loggerErrorSpy = jest.spyOn(Logger.prototype, 'error');

      jest.spyOn(DiscoveryOpenSearchService.prototype, 'generateIndexName').mockReturnValue('index-name');
    });

    it('should create draft index successfully', async () => {
      const createIndexSpy = jest
        .spyOn(DiscoveryOpenSearchService.prototype, 'createIndex')
        .mockResolvedValue(undefined);

      await handler();

      expect(createIndexSpy).toHaveBeenCalledWith('draft-index-name');
    });

    it('should throw error if failure creating draft index', async () => {
      jest.spyOn(DiscoveryOpenSearchService.prototype, 'createIndex').mockRejectedValue(error);

      await expect(handler()).rejects.toThrow(error);
      expect(loggerErrorSpy).toHaveBeenCalledWith('Error building search index', JSON.stringify(error));
    });

    describe('and draft index is created successfully', () => {
      beforeEach(() => {
        jest.spyOn(DiscoveryOpenSearchService.prototype, 'createIndex').mockResolvedValue(undefined);
      });

      it('should convert offers to OpenSearch format and add to index', async () => {
        const addMultipleDocumentsToIndex = jest
          .spyOn(DiscoveryOpenSearchService.prototype, 'addDocumentsToIndex')
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

        const offer: Offer = {
          id: 'offer-1',
          legacyOfferId: 1,
          name: 'Offer 1',
          status: 'active',
          offerType: OfferType.ONLINE,
          offerDescription: 'Description for offer 1',
          image: 'http://example.com/image1.jpg',
          offerStart: TODAY,
          offerEnd: TOMORROW,
          evergreen: false,
          tags: ['tag1', 'tag2'],
          includedTrusts: ['NHS', 'DEN'],
          excludedTrusts: [],
          company: {
            id: 'company-1',
            type: 'company',
            legacyCompanyId: 2,
            name: 'Company 1',
            logo: 'http://example.com/logo1.jpg',
            ageRestrictions: 'None',
            alsoKnownAs: ['Alias 1'],
            includedTrusts: [],
            excludedTrusts: [],
            categories: [
              {
                id: 1,
                name: 'Category 1',
                parentCategoryIds: [2],
                level: 1,
                updatedAt: TODAY,
              },
            ],
            local: false,
            locations: [],
            updatedAt: TODAY,
          },
          categories: [
            {
              id: 1,
              name: 'Category 1',
              parentCategoryIds: [2],
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
            boosted: true,
          },
          updatedAt: TODAY,
        };

        const expectedOpenSearchType: OpenSearchBody = {
          offer_id: 'offer-1',
          legacy_offer_id: 1,
          offer_name: 'Offer 1',
          offer_status: 'active',
          offer_type: OfferType.ONLINE,
          offer_description: 'Description for offer 1',
          offer_description_stripped: 'Description for offer 1',
          offer_image: 'http://example.com/image1.jpg',
          offer_start: offer.offerStart ?? '',
          offer_expires: offer.offerEnd ?? '',
          offer_tags: ['tag1', 'tag2'],
          company_id: 'company-1',
          legacy_company_id: 2,
          company_name: 'Company 1',
          company_name_stripped: 'Company 1',
          company_small_logo: 'http://example.com/logo1.jpg',
          company_tags: ['Alias 1'],
          age_restrictions: 'None',
          included_trusts: ['NHS', 'DEN'],
          excluded_trusts: [],
          category_name: 'Category 1',
          category_id: 1,
          date_offer_last_updated: offer.updatedAt,
        };

        const result = mapOfferToOpenSearchBody(offer);

        expect(result).toStrictEqual(expectedOpenSearchType);
      });

      it('should throw error if failure adding documents to index', async () => {
        jest.spyOn(DiscoveryOpenSearchService.prototype, 'addDocumentsToIndex').mockRejectedValue(error);

        await expect(handler()).rejects.toThrow(error);
        expect(loggerErrorSpy).toHaveBeenCalledWith('Error building search index', JSON.stringify(error));
      });
    });

    describe('and draft index is populated successfully', () => {
      beforeEach(() => {
        jest.spyOn(DiscoveryOpenSearchService.prototype, 'createIndex').mockResolvedValue(undefined);
        jest.spyOn(DiscoveryOpenSearchService.prototype, 'addDocumentsToIndex').mockResolvedValue(undefined);
      });

      it('should clone index successfully', async () => {
        const cloneIndexSpy = jest
          .spyOn(DiscoveryOpenSearchService.prototype, 'cloneIndex')
          .mockResolvedValue(undefined);

        await handler();

        expect(cloneIndexSpy).toHaveBeenCalledWith('draft-index-name', 'index-name');
      });

      it('should throw error if failure cloning index', async () => {
        jest.spyOn(DiscoveryOpenSearchService.prototype, 'cloneIndex').mockRejectedValue(error);

        await expect(handler()).rejects.toThrow(error);
        expect(loggerErrorSpy).toHaveBeenCalledWith('Error building search index', JSON.stringify(error));
      });
    });

    describe('and index is cloned successfully', () => {
      beforeEach(() => {
        jest.spyOn(DiscoveryOpenSearchService.prototype, 'createIndex').mockResolvedValue(undefined);
        jest.spyOn(DiscoveryOpenSearchService.prototype, 'addDocumentsToIndex').mockResolvedValue(undefined);
        jest.spyOn(DiscoveryOpenSearchService.prototype, 'cloneIndex').mockResolvedValue(undefined);
      });

      it('should delete draft index successfully', async () => {
        const deleteIndexSpy = jest
          .spyOn(DiscoveryOpenSearchService.prototype, 'deleteIndex')
          .mockResolvedValue(undefined);

        await handler();

        expect(deleteIndexSpy).toHaveBeenCalledWith('draft-index-name');
      });

      it('should throw error if failure deleting index', async () => {
        jest.spyOn(DiscoveryOpenSearchService.prototype, 'deleteIndex').mockRejectedValue(error);

        await expect(handler()).rejects.toThrow(error);
        expect(loggerErrorSpy).toHaveBeenCalledWith('Error building search index', JSON.stringify(error));
      });
    });
  });
});
