import { MenuType } from '@blc-mono/discovery/application/models/MenuResponse';
import { MenuEventTypes } from '@blc-mono/discovery/infrastructure/eventHandling/events';

import { mapSanityMenuEventTypeToMenuType } from './mapSanityMenuEventTypeToMenuType';

describe('mapSanityMenuEventTypeToMenuType', () => {
  const validTestCases = [
    {
      input: 'menu.marketplace',
      expected: MenuType.MARKETPLACE,
    },
    {
      input: 'menu.dealsOfTheWeek',
      expected: MenuType.DEALS_OF_THE_WEEK,
    },
    {
      input: 'menu.featuredOffers',
      expected: MenuType.FEATURED,
    },
    {
      input: 'menu.waysToSave',
      expected: MenuType.WAYS_TO_SAVE,
    },
    {
      input: 'menu.themed.offer',
      expected: MenuType.FLEXIBLE_OFFERS,
    },
    {
      input: 'menu.themed.event',
      expected: MenuType.FLEXIBLE_EVENTS,
    },
  ];
  it.each(validTestCases)('should return the expected menu type', ({ input, expected }) => {
    expect(mapSanityMenuEventTypeToMenuType(input as MenuEventTypes)).toStrictEqual(expected);
  });

  it('should throw an error if one is not passed that is expected', () => {
    expect(() => mapSanityMenuEventTypeToMenuType('menu.offer' as MenuEventTypes)).toThrow();
  });
});
