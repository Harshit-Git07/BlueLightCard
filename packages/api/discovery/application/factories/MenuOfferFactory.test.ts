import { MenuType } from '../models/MenuResponse';

import { menuOfferFactory } from './MenuOfferFactory';

describe('MenuOfferFactory', () => {
  it('should create a menu offer', () => {
    const menuOffer = menuOfferFactory.build();
    expect(menuOffer).toStrictEqual({
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
        },
        {
          id: '2',
          company: { id: '2' },
        },
        {
          id: '3',
          company: { id: '3' },
        },
      ],
    });
  });

  it('should create a menu offer with overridden menuType', () => {
    const menuOffer = menuOfferFactory.build({ menuType: MenuType.DEALS_OF_THE_WEEK });
    expect(menuOffer.menuType).toBe(MenuType.DEALS_OF_THE_WEEK);
  });
});
