import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { mockClient } from 'aws-sdk-client-mock';
import process from 'process';

import { offerFactory } from '@blc-mono/discovery/application/factories/OfferFactory';
import { Offer } from '@blc-mono/discovery/application/models/Offer';
import { OfferRepository } from '@blc-mono/discovery/application/repositories/Offer/OfferRepository';
import { mapOfferToOfferEntity } from '@blc-mono/discovery/application/repositories/Offer/service/mapper/OfferMapper';
import { DiscoveryStackEnvironmentKeys } from '@blc-mono/discovery/infrastructure/constants/environment';

import * as target from './OfferService';

describe('Offer Service', () => {
  beforeEach(() => {
    process.env[DiscoveryStackEnvironmentKeys.REGION] = 'eu-west-2';
    process.env[DiscoveryStackEnvironmentKeys.SEARCH_OFFER_COMPANY_TABLE_NAME] = 'search-offer-company-table';
  });

  afterEach(() => {
    delete process.env[DiscoveryStackEnvironmentKeys.REGION];
    delete process.env[DiscoveryStackEnvironmentKeys.SEARCH_OFFER_COMPANY_TABLE_NAME];
    mockDynamoDB.reset();
  });

  const mockDynamoDB = mockClient(DynamoDBDocumentClient);

  describe('insertOffer', () => {
    const offer = offerFactory.build();

    it('should insert an offer successfully', async () => {
      givenOfferRepositoryInsertReturnsSuccessfully(offer);

      const result = await target.insertOffer(offer);

      expect(result).toEqual(offer);
    });

    it('should throw error when offer failed to insert', async () => {
      givenOfferRepositoryInsertThrowsAnError();

      await expect(target.insertOffer(offer)).rejects.toThrow(
        `Error occurred inserting new Offer with id: [${offer.id}]: [Error: DynamoDB error]`,
      );
    });

    const givenOfferRepositoryInsertReturnsSuccessfully = (offer: Offer) => {
      const offerEntity = mapOfferToOfferEntity(offer);

      jest.spyOn(OfferRepository.prototype, 'insert').mockResolvedValue(offerEntity);
    };

    const givenOfferRepositoryInsertThrowsAnError = () => {
      jest.spyOn(OfferRepository.prototype, 'insert').mockRejectedValue(new Error('DynamoDB error'));
    };
  });

  describe('deleteOffer', () => {
    const offer = offerFactory.build();

    it('should delete an offer successfully', async () => {
      givenOfferRepositoryDeleteReturnsSuccessfully(offer);

      const result = await target.deleteOffer(offer.id, offer.company.id);

      expect(result).toEqual(offer);
    });

    it('should throw error when offer failed to insert', async () => {
      givenOfferRepositoryDeleteThrowsAnError();

      await expect(target.deleteOffer(offer.id, offer.company.id)).rejects.toThrow(
        `Error occurred deleting Offer with id: [${offer.id}]: [Error: DynamoDB error]`,
      );
    });

    const givenOfferRepositoryDeleteReturnsSuccessfully = (offer: Offer) => {
      const offerEntity = mapOfferToOfferEntity(offer);

      jest.spyOn(OfferRepository.prototype, 'delete').mockResolvedValue(offerEntity);
    };

    const givenOfferRepositoryDeleteThrowsAnError = () => {
      jest.spyOn(OfferRepository.prototype, 'delete').mockRejectedValue(new Error('DynamoDB error'));
    };
  });

  describe('getOfferById', () => {
    const offer = offerFactory.build();

    it('should get an offer by id successfully', async () => {
      givenOfferRepositoryGetCompanyByIdReturns(offer);

      const result = await target.getOfferById(offer.id, offer.company.id);

      expect(result).toEqual(offer);
    });

    it('should return "undefined" when no offer found', async () => {
      givenOfferRepositoryGetCompanyByIdReturns(undefined);

      const result = await target.getOfferById(offer.id, offer.company.id);

      expect(result).toEqual(undefined);
    });

    it('should throw error when failure in retrieving offer by id', async () => {
      givenOfferRepositoryGetOfferByIdThrowsAnError();

      await expect(target.getOfferById(offer.id, offer.company.id)).rejects.toThrow(
        `Error occurred retrieving Offer by id: [${offer.id}]: [Error: DynamoDB error]`,
      );
    });

    const givenOfferRepositoryGetCompanyByIdReturns = (offer: Offer | undefined) => {
      const offerEntity = offer ? mapOfferToOfferEntity(offer) : undefined;

      jest.spyOn(OfferRepository.prototype, 'retrieveById').mockResolvedValue(offerEntity);
    };

    const givenOfferRepositoryGetOfferByIdThrowsAnError = () => {
      jest.spyOn(OfferRepository.prototype, 'retrieveById').mockRejectedValue(new Error('DynamoDB error'));
    };
  });

  describe('getNonLocalOffers', () => {
    const offers = offerFactory.buildList(3);

    it('should get a list of offers successfully', async () => {
      givenOfferRepositoryGetNonOffersReturns(offers);

      const result = await target.getNonLocalOffers();

      expect(result).toEqual(offers);
    });

    it('should return an empty list of offers if no offers found', async () => {
      givenOfferRepositoryGetNonOffersReturns([]);

      const result = await target.getNonLocalOffers();

      expect(result).toEqual([]);
    });

    it('should throw error when failure in retrieving offer by id', async () => {
      givenOfferRepositoryGetNonLocalThrowsAnError();

      await expect(target.getNonLocalOffers()).rejects.toThrow(
        'Error occurred retrieving non local offers: [Error: DynamoDB error]',
      );
    });

    const givenOfferRepositoryGetNonOffersReturns = (offers: Offer[]) => {
      const offerEntities = offers.map(mapOfferToOfferEntity);

      jest.spyOn(OfferRepository.prototype, 'getNonLocal').mockResolvedValue(offerEntities);
    };

    const givenOfferRepositoryGetNonLocalThrowsAnError = () => {
      jest.spyOn(OfferRepository.prototype, 'getNonLocal').mockRejectedValue(new Error('DynamoDB error'));
    };
  });

  describe('getOffersByCompany', () => {
    const offers = offerFactory.buildList(3);
    const companyId = 'companyId';

    it('should offers by company successfully', async () => {
      givenOfferRepositoryRetrieveByCompanyIdReturns(offers);

      const result = await target.getOffersByCompany(companyId);

      expect(result).toEqual(offers);
    });

    it('should return an empty list of offers if no offers found for company', async () => {
      givenOfferRepositoryRetrieveByCompanyIdReturns([]);

      const result = await target.getOffersByCompany(companyId);

      expect(result).toEqual([]);
    });

    it('should throw error when failure in retrieving offer by id', async () => {
      givenOfferRepositoryRetrieveByCompanyIdThrowsAnError();

      await expect(target.getOffersByCompany(companyId)).rejects.toThrow(
        `Error occurred retrieving Offers for a Company by companyId: [${companyId}]: [Error: DynamoDB error]`,
      );
    });

    const givenOfferRepositoryRetrieveByCompanyIdReturns = (offers: Offer[]) => {
      const offerEntities = offers.map(mapOfferToOfferEntity);

      jest.spyOn(OfferRepository.prototype, 'retrieveByCompanyId').mockResolvedValue(offerEntities);
    };

    const givenOfferRepositoryRetrieveByCompanyIdThrowsAnError = () => {
      jest.spyOn(OfferRepository.prototype, 'retrieveByCompanyId').mockRejectedValue(new Error('DynamoDB error'));
    };
  });
});
