import { EventType } from './Offer';

export type EventResponse = {
  eventID: string;
  eventName: string;
  eventDescription: string;
  offerType: EventType;
  imageURL: string;
  venueID: string;
  venueName: string;
};
