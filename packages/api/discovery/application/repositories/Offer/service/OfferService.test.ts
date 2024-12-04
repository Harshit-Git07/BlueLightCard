import process from 'process';

import { offerFactory } from '@blc-mono/discovery/application/factories/OfferFactory';
import { Offer } from '@blc-mono/discovery/application/models/Offer';
import { OfferRepository } from '@blc-mono/discovery/application/repositories/Offer/OfferRepository';
import { mapOfferToOfferEntity } from '@blc-mono/discovery/application/repositories/Offer/service/mapper/OfferMapper';
import { DiscoveryStackEnvironmentKeys } from '@blc-mono/discovery/infrastructure/constants/environment';

import * as target from './OfferService';

const offers = offerFactory.buildList(3);
const expectedOffers = offers.map((offer) => ({
  ...offer,
  includedTrusts: ['companyTrustRestriction1', 'companyTrustRestriction2'],
}));

describe('Offer Service', () => {
  beforeEach(() => {
    process.env[DiscoveryStackEnvironmentKeys.REGION] = 'eu-west-2';
    process.env[DiscoveryStackEnvironmentKeys.SEARCH_OFFER_COMPANY_TABLE_NAME] = 'search-offer-company-table';
  });

  afterEach(() => {
    delete process.env[DiscoveryStackEnvironmentKeys.REGION];
    delete process.env[DiscoveryStackEnvironmentKeys.SEARCH_OFFER_COMPANY_TABLE_NAME];
  });

  describe('insertOffer', () => {
    const offer = offerFactory.build();

    it('should insert an offer successfully', async () => {
      const mockInsert = jest.spyOn(OfferRepository.prototype, 'insert').mockResolvedValue();

      await target.insertOffer(offer);

      expect(mockInsert).toHaveBeenCalledWith(mapOfferToOfferEntity(offer));
    });

    it('should throw error when offer failed to insert', async () => {
      givenOfferRepositoryInsertThrowsAnError();

      await expect(target.insertOffer(offer)).rejects.toThrow(
        `Error occurred inserting new Offer with id: [${offer.id}]: [Error: DynamoDB error]`,
      );
    });

    const givenOfferRepositoryInsertThrowsAnError = () => {
      jest.spyOn(OfferRepository.prototype, 'insert').mockRejectedValue(new Error('DynamoDB error'));
    };
  });

  describe('insertOffers', () => {
    const offers = offerFactory.buildList(5);

    it('should insert multiple offers successfully', async () => {
      givenOfferRepositoryBatchInsertReturnsSuccessfully();

      await expect(target.insertOffers(offers)).resolves.not.toThrow();
    });

    it('should throw error when multiple offers failed to insert', async () => {
      givenOfferRepositoryBatchInsertThrowsAnError();

      await expect(target.insertOffers(offers)).rejects.toThrow(
        `Error occurred inserting Offers as batch, amount: [${offers.length}]: [Error: DynamoDB error]`,
      );
    });

    const givenOfferRepositoryBatchInsertReturnsSuccessfully = () => {
      jest.spyOn(OfferRepository.prototype, 'batchInsert').mockResolvedValue();
    };

    const givenOfferRepositoryBatchInsertThrowsAnError = () => {
      jest.spyOn(OfferRepository.prototype, 'batchInsert').mockRejectedValue(new Error('DynamoDB error'));
    };
  });

  describe('deleteOffer', () => {
    const offer = offerFactory.build();

    it('should delete an offer successfully', async () => {
      const mockDelete = jest.spyOn(OfferRepository.prototype, 'delete').mockResolvedValue();

      await target.deleteOffer(offer.id, offer.company.id);

      expect(mockDelete).toHaveBeenCalledWith(offer.id, offer.company.id);
    });

    it('should throw error when offer failed to insert', async () => {
      givenOfferRepositoryDeleteThrowsAnError();

      await expect(target.deleteOffer(offer.id, offer.company.id)).rejects.toThrow(
        `Error occurred deleting Offer with id: [${offer.id}]: [Error: DynamoDB error]`,
      );
    });

    const givenOfferRepositoryDeleteThrowsAnError = () => {
      jest.spyOn(OfferRepository.prototype, 'delete').mockRejectedValue(new Error('DynamoDB error'));
    };
  });

  describe('getOfferById', () => {
    const offer = offerFactory.build();

    it('should get an offer by id successfully', async () => {
      givenOfferRepositoryGetCompanyByIdReturns(offer);

      const result = await target.getOfferById(offer.id, offer.company.id);

      expect(result).toEqual({
        ...offer,
        includedTrusts: ['companyTrustRestriction1', 'companyTrustRestriction2'],
      });
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
    it('should get a list of offers successfully', async () => {
      givenOfferRepositoryGetNonOffersReturns(offers);

      const result = await target.getNonLocalOffers();

      expect(result).toEqual(expectedOffers);
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
    const companyId = 'companyId';

    it('should offers by company successfully', async () => {
      givenOfferRepositoryRetrieveByCompanyIdReturns(offers);

      const result = await target.getOffersByCompany(companyId);

      expect(result).toEqual(expectedOffers);
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

  describe('getOffersByIds', () => {
    const retrieveByIdsSpy = jest.spyOn(OfferRepository.prototype, 'retrieveByIds');

    it('should getOffersByIds successfully', async () => {
      givenOfferRepositoryRetrieveByIdsReturns(offers);
      const result = await target.getOffersByIds([{ id: 'offerId', companyId: 'companyId' }]);
      expect(result).toEqual(expectedOffers);
    });

    it('should remove duplicates', async () => {
      givenOfferRepositoryRetrieveByIdsReturns(offers);
      await target.getOffersByIds([
        { id: 'offerId', companyId: 'companyId' },
        { id: 'offerId', companyId: 'companyId' },
        { id: 'offerId', companyId: 'companyId' },
      ]);
      expect(retrieveByIdsSpy).toHaveBeenCalledWith([{ id: 'offerId', companyId: 'companyId' }]);
    });

    it('should throw error when failure in retrieving offer by ids', async () => {
      givenOfferRepositoryRetrieveByIdsReturnsThrowsAnError();

      await expect(target.getOffersByIds([{ id: 'offerId', companyId: 'companyId' }])).rejects.toThrow(
        `Error occurred retrieving Offers by ids: [Error: DynamoDB error]`,
      );
    });

    const givenOfferRepositoryRetrieveByIdsReturns = (offers: Offer[]) => {
      const offerEntities = offers.map(mapOfferToOfferEntity);

      retrieveByIdsSpy.mockResolvedValue(offerEntities);
    };
    const givenOfferRepositoryRetrieveByIdsReturnsThrowsAnError = () => {
      retrieveByIdsSpy.mockRejectedValue(new Error('DynamoDB error'));
    };
  });
});
