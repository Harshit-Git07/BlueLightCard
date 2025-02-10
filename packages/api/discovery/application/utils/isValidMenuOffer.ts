import { isAfter, isBefore } from 'date-fns';

import { MenuEventOffer, MenuOffer } from '../models/Menu';

import { isValidEvent, isValidOffer } from './isValidOffer';

export const isValidMenuOffer = (menuOffer: MenuOffer, dob: string, organisation: string): boolean => {
  return isValidOffer(menuOffer, dob, organisation) && isInSchedule(menuOffer);
};

export const isValidMenuEvent = (menuEvent: MenuEventOffer, dob: string, organisation: string): boolean => {
  return isValidEvent(menuEvent, dob, organisation) && isInSchedule(menuEvent);
};

const isInSchedule = (offer: MenuOffer | MenuEventOffer) => {
  const currentTime = new Date();
  if (!offer.start) {
    if (!offer.end) {
      return true;
    }
    return isBefore(currentTime, new Date(offer.end));
  }
  if (!offer.end) {
    return isAfter(currentTime, new Date(offer.start));
  }
  return isBefore(currentTime, new Date(offer.end)) && isAfter(currentTime, new Date(offer.start));
};
