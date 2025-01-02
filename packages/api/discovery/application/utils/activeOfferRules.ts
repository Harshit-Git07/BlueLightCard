import { isAfter, isBefore, isWithinInterval } from 'date-fns';

import { EventOffer, Offer } from '@blc-mono/discovery/application/models/Offer';

export const isActiveOffer = (offer: Offer): boolean => {
  if (offer.status !== 'live') {
    return false;
  }

  if (offer.evergreen) {
    return true;
  }

  const startDate = offer.offerStart ? new Date(offer.offerStart) : undefined;
  const endDate = offer.offerEnd ? new Date(offer.offerEnd) : undefined;

  const now = new Date();

  if (startDate && endDate) {
    return isWithinInterval(now, { start: startDate, end: endDate });
  }

  if (startDate) {
    return isAfter(now, startDate);
  }

  if (endDate) {
    return isBefore(now, endDate);
  }

  return true;
};

export const isActiveEventOffer = (event: EventOffer): boolean => {
  if (event.status !== 'live') {
    return false;
  }

  const startDate = event.offerStart ? new Date(event.offerStart) : undefined;
  const guestlistCompleteByDate = event.guestlistCompleteByDate ? new Date(event.guestlistCompleteByDate) : undefined;

  const now = new Date();

  if (guestlistCompleteByDate && isAfter(now, guestlistCompleteByDate)) {
    return false;
  }

  if (startDate && isAfter(now, startDate)) {
    return false;
  }

  return true;
};
