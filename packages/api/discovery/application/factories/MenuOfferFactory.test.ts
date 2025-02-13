import { MenuType } from '../models/MenuResponse';

import { ingestedMenuOfferFactory } from './MenuOfferFactory';

describe('MenuOfferFactory', () => {
  it('should create a menu offer', () => {
    const menuOffer = ingestedMenuOfferFactory.build();
    expect(menuOffer).toEqual({
      id: '1',
      name: 'Sample Menu',
      startTime: '2022-09-01T00:00:00',
      endTime: '2024-09-30T23:59:59',
      updatedAt: '2022-09-01T00:00:00',
      menuType: MenuType.MARKETPLACE,
      offers: [
        {
          id: '1',
          company: { id: '1' },
          start: '2021-09-01T00:00:00Z',
          end: '2021-09-01T00:00:00Z',
          position: 0,
          overrides: {},
        },
        {
          id: '2',
          company: { id: '2' },
          start: '2021-09-01T00:00:00Z',
          end: '2021-09-01T00:00:00Z',
          position: 1,
          overrides: {},
        },
        {
          id: '3',
          company: { id: '3' },
          start: '2021-09-01T00:00:00Z',
          end: '2021-09-01T00:00:00Z',
          position: 2,
          overrides: {},
        },
      ],
    });
  });

  it('should create a menu offer with overridden menuType', () => {
    const menuOffer = ingestedMenuOfferFactory.build({ menuType: MenuType.DEALS_OF_THE_WEEK });
    expect(menuOffer.menuType).toBe(MenuType.DEALS_OF_THE_WEEK);
  });
});
