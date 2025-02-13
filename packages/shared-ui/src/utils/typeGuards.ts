import { EventCategoryData, EventOffer } from '../types';

export function isEventCategoryData(data: unknown): data is EventCategoryData {
  return (
    !!data &&
    typeof data === 'object' &&
    data !== null &&
    'id' in data &&
    typeof (data as EventCategoryData).id === 'string' &&
    'name' in data &&
    typeof (data as EventCategoryData).name === 'string' &&
    'data' in data &&
    Array.isArray((data as EventCategoryData).data) &&
    (data as EventCategoryData).data.every(isEventOffer)
  );
}

function isEventOffer(data: unknown): data is EventOffer {
  return (
    !!data &&
    typeof data === 'object' &&
    data !== null &&
    'eventID' in data &&
    typeof (data as EventOffer).eventID === 'string' &&
    'venueID' in data &&
    typeof (data as EventOffer).venueID === 'string' &&
    'venueName' in data &&
    typeof (data as EventOffer).venueName === 'string' &&
    'offerType' in data &&
    (data as EventOffer).offerType === 'ticket' &&
    'eventName' in data &&
    typeof (data as EventOffer).eventName === 'string' &&
    'imageURL' in data &&
    typeof (data as EventOffer).imageURL === 'string' &&
    'eventDescription' in data &&
    typeof (data as EventOffer).eventDescription === 'string'
  );
}
