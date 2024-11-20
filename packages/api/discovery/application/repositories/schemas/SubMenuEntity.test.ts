import { MenuType } from '@blc-mono/discovery/application/models/MenuResponse';

import { SubMenuKeyBuilders } from './SubMenuEntity';

describe('Sub Menu Entity Key Builders', () => {
  it('should build partition key', () => {
    const result = SubMenuKeyBuilders.buildPartitionKey('1');

    expect(result).toBe('MENU-1');
  });

  it('should build sort key', () => {
    const result = SubMenuKeyBuilders.buildSortKey('1');

    expect(result).toBe('SUB_MENU-1');
  });

  it('should build gsi1 partition key', () => {
    const result = SubMenuKeyBuilders.buildGsi1PartitionKey(MenuType.FEATURED);

    expect(result).toBe('MENU_TYPE-featured');
  });

  it('should build gsi1 sort key', () => {
    const result = SubMenuKeyBuilders.buildGsi1SortKey(MenuType.FEATURED);

    expect(result).toBe('MENU_TYPE-featured');
  });

  it('should build gsi2 partition key', () => {
    const result = SubMenuKeyBuilders.buildGsi2PartitionKey('1');

    expect(result).toBe('SUB_MENU-1');
  });

  it('should build gsi2 sort key', () => {
    const result = SubMenuKeyBuilders.buildGsi2SortKey('1');

    expect(result).toBe('SUB_MENU-1');
  });
});
