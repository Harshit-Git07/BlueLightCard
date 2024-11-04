import { MenuType } from '../models/MenuResponse';

import { menuFactory } from './MenuFactory';

describe('Menu Factory', () => {
  it('should build a default HomepageMenu object', () => {
    const menu = menuFactory.build();
    expect(menu).toEqual({
      id: '1',
      name: 'Sample Menu',
      startTime: '2022-09-01T00:00:00',
      endTime: '2024-09-30T23:59:59',
      updatedAt: '2022-09-01T00:00:00',
      menuType: MenuType.MARKETPLACE,
    });
  });

  it('should build a HomepageMenu object with overridden name', () => {
    const menu = menuFactory.build({ name: 'Custom Menu' });
    expect(menu.name).toBe('Custom Menu');
  });
});
