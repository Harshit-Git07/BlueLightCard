import { HomepageMenu } from '@blc-mono/discovery/application/models/HomepageMenu';
import { MenuEntity } from '@blc-mono/discovery/application/repositories/schemas/MenuEntity';

import { mapHomepageMenuToMenuEntity, mapMenuEntityToHomepageMenu } from './MenuMapper';

const homepageMenu: HomepageMenu = {
  id: 'menu1',
  name: 'menu1',
  startTime: new Date(Date.now() - 24 * 3600000).toLocaleDateString(),
  endTime: new Date(Date.now() + 24 * 3600000).toLocaleDateString(),
  updatedAt: new Date().toLocaleDateString(),
};

const menuEntity: MenuEntity = {
  ...homepageMenu,
  partitionKey: 'MENU-menu1',
  sortKey: 'MENU-menu1',
};

describe('MenuMapper', () => {
  it('should map MenuEntity to HomepageMenu', () => {
    const result = mapMenuEntityToHomepageMenu(menuEntity);
    expect(result).toEqual(homepageMenu);
  });

  it('should map HomepageMenu to MenuEntity', () => {
    const result = mapHomepageMenuToMenuEntity(homepageMenu);
    expect(result).toEqual(menuEntity);
  });
});
