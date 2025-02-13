import { EventCategoryData, EventOffer } from '../../types';
import { isEventCategoryData } from '../typeGuards';

describe('Type Guards', () => {
  describe('isEventCategoryData', () => {
    const ticketOfferType = 'ticket';
    const nonTicketOfferType = 'nonTicketOfferType';
    const validEventOffer: EventOffer = {
      offerType: ticketOfferType,
      eventID: 'mockEventID',
      venueID: 'mockVenueID',
      venueName: 'mockVenueName',
      eventName: 'mockEventName',
      imageURL: 'mockImageURL',
      eventDescription: 'mockEventDescription',
    };
    const inValidEventOffer: EventOffer = {
      offerType: nonTicketOfferType as typeof ticketOfferType, // want it to fail in the guard
      eventID: 'mockEventID',
      venueID: 'mockVenueID',
      venueName: 'mockVenueName',
      eventName: 'mockEventName',
      imageURL: 'mockImageURL',
      eventDescription: 'mockEventDescription',
    };

    it('should return true if all offers in data are valid EventOffers', () => {
      const validCategoryData: EventCategoryData = {
        id: 'mockId',
        name: 'mockCategory',
        data: [validEventOffer, validEventOffer],
      };
      expect(isEventCategoryData(validCategoryData)).toBe(true);
    });

    it('should return false if at least one offer in data is invalid', () => {
      const invalidCategoryData: EventCategoryData = {
        id: 'mockId',
        name: 'mockCategory',
        data: [validEventOffer, inValidEventOffer],
      };
      expect(isEventCategoryData(invalidCategoryData)).toBe(false);
    });
  });
});
