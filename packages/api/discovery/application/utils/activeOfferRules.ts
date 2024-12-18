import { isAfter, isBefore, isWithinInterval } from 'date-fns';

import { Offer } from '@blc-mono/discovery/application/models/Offer';

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
