import { addMonths, subMonths } from 'date-fns';

import { menuFactory } from '../factories/MenuFactory';
import { menuOfferFactory } from '../factories/MenuOfferFactory';

import { isValidMenu } from './isValidMenu';

const menu = menuFactory.build();
const menuOffer = menuOfferFactory.buildList(1);

const menuWithOffers = {
  ...menu,
  offers: menuOffer,
};

describe('isValidMenu', () => {
  const futureTime = addMonths(new Date(), 1).toISOString();
  const pastTime = subMonths(new Date(), 1).toISOString();

  const testCases = [
    { startTime: undefined, endTime: undefined, isValidResult: true },
    { startTime: undefined, endTime: futureTime, isValidResult: true },
    { startTime: pastTime, endTime: undefined, isValidResult: true },
    { startTime: pastTime, endTime: futureTime, isValidResult: true },
    { startTime: pastTime, endTime: pastTime, isValidResult: false },
    { startTime: futureTime, endTime: futureTime, isValidResult: false },
  ];

  it.each(testCases)(
    'should return the correct value depending on the menu start and end time',
    ({ isValidResult, endTime, startTime }) => {
      expect(isValidMenu({ ...menuWithOffers, startTime, endTime })).toBe(isValidResult);
    },
  );
});
