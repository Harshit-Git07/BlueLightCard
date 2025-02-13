import {
  EventOffer,
  Offer,
  EventCategoryData,
  CategoryData,
  FlexibleOfferData,
} from '@bluelightcard/shared-ui';

export function mapCategoryEventsToOffers(eventCategoryData: EventCategoryData): CategoryData {
  return {
    ...eventCategoryData,
    data: mapEventsToOffers(eventCategoryData.data),
  };
}

export function mapFlexibleEventsToOffers(flexibleOfferData: FlexibleOfferData): FlexibleOfferData {
  return {
    ...flexibleOfferData,
    offers: [...flexibleOfferData.offers, ...mapEventsToOffers(flexibleOfferData.events)],
  };
}

/**
 * Transforms the keys on an `EventOffer` (aka "ticket" offer type) to match the
 * keys of other offers.
 *
 * This lets us consistently display offers without a lot of messy type checking
 * in components.
 */
function mapEventsToOffers(eventOffers: EventOffer[]): Offer[] {
  if (!eventOffers) return []; // TODO: shouldn't need this when the endpoint is updated

  return eventOffers.map((eventOffer) => {
    return {
      offerID: eventOffer.eventID,
      companyID: eventOffer.venueID,
      companyName: eventOffer.venueName,
      offerType: eventOffer.offerType,
      offerName: eventOffer.eventName,
      imageURL: eventOffer.imageURL,
      offerDescription: eventOffer.eventDescription,
    };
  });
}
