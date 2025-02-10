import { isAfter, isBefore } from 'date-fns';

import { MenuWithOffers, MenuWithSubMenuAndOffers, MenuWithSubMenus } from '../models/Menu';

export const isValidMenu = (menu: MenuWithOffers | MenuWithSubMenuAndOffers | MenuWithSubMenus): boolean => {
  const currentTime = new Date();
  if (!menu.startTime) {
    if (!menu.endTime) {
      return true;
    }
    return isBefore(currentTime, new Date(menu.endTime));
  }
  if (!menu.endTime) {
    return isAfter(currentTime, new Date(menu.startTime));
  }
  return isBefore(currentTime, new Date(menu.endTime)) && isAfter(currentTime, new Date(menu.startTime));
};
