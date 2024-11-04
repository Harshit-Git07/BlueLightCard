import * as Factory from 'factory.ts';

import { Menu } from '../models/Menu';
import { MenuType } from '../models/MenuResponse';

export const menuFactory = Factory.Sync.makeFactory<Menu>({
  id: Factory.each((i) => `${i + 1}`),
  name: 'Sample Menu',
  startTime: '2022-09-01T00:00:00',
  endTime: '2024-09-30T23:59:59',
  updatedAt: '2022-09-01T00:00:00',
  menuType: MenuType.MARKETPLACE,
});
