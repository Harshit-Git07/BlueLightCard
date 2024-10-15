import { MenuKeyBuilders } from '@blc-mono/discovery/application/repositories/schemas/MenuEntity';

describe('Menu Entity Key Builders', () => {
  it('should build partition key', () => {
    const result = MenuKeyBuilders.buildPartitionKey('1');

    expect(result).toBe('MENU-1');
  });

  it('should build sort key', () => {
    const result = MenuKeyBuilders.buildSortKey('1');

    expect(result).toBe('MENU-1');
  });
});
