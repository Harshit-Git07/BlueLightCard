import {
  Offer,
  EventOffer,
  FlexibleOfferData,
  EventCategoryData,
  CategoryData,
} from '../../../types';
import {
  mapFlexibleEventsToOffers,
  mapCategoryEventsToOffers,
} from '../../offers/offerTransformations';

describe('mapFlexibleEventsToOffers', () => {
  test('should add mapped EventOffers to Offers and retain original EventOffers', () => {
    const mockId = 'mockId';
    const mockTitle = 'mockTitle';
    const mockDescription = 'mockDescription';
    const mockImageURL = 'mockImageURL';
    const mockEventID = 'mockEventID';
    const mockVenueID = 'mockVenueID';
    const mockVenueName = 'mockVenueName';
    const mockOfferType = 'ticket';
    const mockEventName = 'mockEventName';
    const mockEventDescription = 'mockEventDescription';

    const mockOffer: Offer = {
      offerID: 'mockOfferID',
      companyID: 'mockCompanyID',
      companyName: 'mockCompanyName',
      offerType: 'other',
      offerName: 'mockOfferName',
      imageURL: 'mockImageURL',
      offerDescription: 'mockOfferDescription',
    };

    const mockEventOffer: EventOffer = {
      eventID: mockEventID,
      venueID: mockVenueID,
      venueName: mockVenueName,
      offerType: mockOfferType,
      eventName: mockEventName,
      imageURL: mockImageURL,
      eventDescription: mockEventDescription,
    };

    const mockFlexibleOfferData: FlexibleOfferData = {
      id: mockId,
      title: mockTitle,
      description: mockDescription,
      imageURL: mockImageURL,
      offers: [mockOffer],
      events: [mockEventOffer],
    };

    const expectedNormaliseFlexibleOfferData: FlexibleOfferData = {
      id: mockId,
      title: mockTitle,
      description: mockDescription,
      imageURL: mockImageURL,
      offers: [
        mockOffer,
        {
          offerID: mockEventID,
          companyID: mockVenueID,
          companyName: mockVenueName,
          offerType: 'ticket',
          offerName: mockEventName,
          imageURL: mockImageURL,
          offerDescription: mockEventDescription,
        },
      ],
      events: [mockEventOffer],
    };

    const normaliseFlexibleOfferData = mapFlexibleEventsToOffers(mockFlexibleOfferData);

    expect(normaliseFlexibleOfferData).toEqual(expectedNormaliseFlexibleOfferData);
  });
});

describe('mapCategoryEventsToOffers', () => {
  test('should map event keys to offer keys', () => {
    const mockId = 'mockId';
    const mockName = 'mockName';
    const mockEventID = 'mockEventID';
    const mockVenueID = 'mockVenueID';
    const mockVenueName = 'mockVenueName';
    const mockOfferType = 'ticket';
    const mockEventName = 'mockEventName';
    const mockImageURL = 'mockImageURL';
    const mockEventDescription = 'mockEventDescription';
    const mockEventOffer: EventOffer = {
      eventID: mockEventID,
      venueID: mockVenueID,
      venueName: mockVenueName,
      offerType: mockOfferType,
      eventName: mockEventName,
      imageURL: mockImageURL,
      eventDescription: mockEventDescription,
    };
    const eventCategoryData: EventCategoryData = {
      id: mockId,
      name: mockName,
      data: [mockEventOffer],
    };
    const expectedMappedOfferData: CategoryData = {
      id: mockId,
      name: mockName,
      data: [
        {
          offerID: mockEventID,
          companyID: mockVenueID,
          companyName: mockVenueName,
          offerType: mockOfferType,
          offerName: mockEventName,
          imageURL: mockImageURL,
          offerDescription: mockEventDescription,
        },
      ],
    };

    const mappedEventCategoryData = mapCategoryEventsToOffers(eventCategoryData);

    expect(mappedEventCategoryData.id).toBe(expectedMappedOfferData.id);
    expect(mappedEventCategoryData.name).toBe(expectedMappedOfferData.name);
    expect(mappedEventCategoryData.data).toEqual(expectedMappedOfferData.data);
  });
});
