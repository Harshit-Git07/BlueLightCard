import process from 'process';

import { eventFactory } from '@blc-mono/discovery/application/factories/OfferFactory';
import { EventOffer } from '@blc-mono/discovery/application/models/Offer';
import { EventRepository } from '@blc-mono/discovery/application/repositories/Offer/EventRepository';
import { DiscoveryStackEnvironmentKeys } from '@blc-mono/discovery/infrastructure/constants/environment';

import * as target from './EventService';
import { mapEventToEventEntity } from './mapper/EventMapper';

const events = eventFactory.buildList(3);

describe('Event Service', () => {
  beforeEach(() => {
    process.env[DiscoveryStackEnvironmentKeys.REGION] = 'eu-west-2';
    process.env[DiscoveryStackEnvironmentKeys.SEARCH_OFFER_COMPANY_TABLE_NAME] = 'search-offer-company-table';
  });

  afterEach(() => {
    delete process.env[DiscoveryStackEnvironmentKeys.REGION];
    delete process.env[DiscoveryStackEnvironmentKeys.SEARCH_OFFER_COMPANY_TABLE_NAME];
  });

  describe('insertEvent', () => {
    const event = eventFactory.build();

    it('should insert an event successfully', async () => {
      const mockInsert = jest.spyOn(EventRepository.prototype, 'insert').mockResolvedValue();

      await target.insertEvent(event);

      expect(mockInsert).toHaveBeenCalledWith(mapEventToEventEntity(event));
    });

    it('should throw error when event failed to insert', async () => {
      givenOfferRepositoryInsertThrowsAnError();

      await expect(target.insertEvent(event)).rejects.toThrow(
        `Error occurred inserting new Event with id: [${event.id}]: [Error: DynamoDB error]`,
      );
    });

    const givenOfferRepositoryInsertThrowsAnError = () => {
      jest.spyOn(EventRepository.prototype, 'insert').mockRejectedValue(new Error('DynamoDB error'));
    };
  });

  describe('deleteEvent', () => {
    const event = eventFactory.build();

    it('should delete an event successfully', async () => {
      const mockDelete = jest.spyOn(EventRepository.prototype, 'delete').mockResolvedValue();

      await target.deleteEvent(event.id, event.venue.id);

      expect(mockDelete).toHaveBeenCalledWith(event.id, event.venue.id);
    });

    it('should throw error when event failed to insert', async () => {
      givenOfferRepositoryDeleteThrowsAnError();

      await expect(target.deleteEvent(event.id, event.venue.id)).rejects.toThrow(
        `Error occurred deleting Event with id: [${event.id}]: [Error: DynamoDB error]`,
      );
    });

    const givenOfferRepositoryDeleteThrowsAnError = () => {
      jest.spyOn(EventRepository.prototype, 'delete').mockRejectedValue(new Error('DynamoDB error'));
    };
  });

  describe('getEventById', () => {
    const event = eventFactory.build();

    it('should get an event by id successfully', async () => {
      givenEventRepositoryGetByIdReturns(event);

      const result = await target.getEventById(event.id, event.venue.id);

      expect(result).toEqual(event);
    });

    it('should return "undefined" when no offer found', async () => {
      givenEventRepositoryGetByIdReturns(undefined);

      const result = await target.getEventById(event.id, event.venue.id);

      expect(result).toEqual(undefined);
    });

    it('should throw error when failure in retrieving offer by id', async () => {
      givenEventRepositoryGetEventByIdThrowsAnError();

      await expect(target.getEventById(event.id, event.venue.id)).rejects.toThrow(
        `Error occurred retrieving Event by id: [${event.id}]: [Error: DynamoDB error]`,
      );
    });

    const givenEventRepositoryGetByIdReturns = (event: EventOffer | undefined) => {
      const entity = event ? mapEventToEventEntity(event) : undefined;

      jest.spyOn(EventRepository.prototype, 'retrieveById').mockResolvedValue(entity);
    };

    const givenEventRepositoryGetEventByIdThrowsAnError = () => {
      jest.spyOn(EventRepository.prototype, 'retrieveById').mockRejectedValue(new Error('DynamoDB error'));
    };
  });

  describe('getEventsByIds', () => {
    it('should getEventsByIds successfully', async () => {
      givenEventRepositoryRetrieveByIdsReturns(events);
      const result = await target.getEventsByIds([{ id: 'offerId', venueId: 'id' }]);
      expect(result).toEqual(events);
    });

    it('should throw error when failure in retrieving offer by ids', async () => {
      givenEventRepositoryRetrieveByIdsReturnsThrowsAnError();

      await expect(target.getEventsByIds([{ id: 'offerId', venueId: 'id' }])).rejects.toThrow(
        `Error occurred retrieving Events by ids: [Error: DynamoDB error]`,
      );
    });

    const givenEventRepositoryRetrieveByIdsReturns = (events: EventOffer[]) => {
      const entities = events.map(mapEventToEventEntity);

      jest.spyOn(EventRepository.prototype, 'retrieveByIds').mockResolvedValue(entities);
    };
    const givenEventRepositoryRetrieveByIdsReturnsThrowsAnError = () => {
      jest.spyOn(EventRepository.prototype, 'retrieveByIds').mockRejectedValue(new Error('DynamoDB error'));
    };
  });
});
