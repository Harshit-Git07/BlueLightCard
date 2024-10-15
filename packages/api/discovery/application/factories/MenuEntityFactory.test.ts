import { menuEntityFactory } from './MenuEntityFactory';

describe('Menu Entity Factory', () => {
  it('should build a default Menu Entity Object', () => {
    const menuEntity = menuEntityFactory.build();
    expect(menuEntity).toStrictEqual({
      partitionKey: 'MENU-1',
      sortKey: 'MENU-1',
      id: `1`,
      name: 'Sample Menu',
      startTime: '2024-09-01T00:00:00',
      endTime: '2024-09-30T23:59:59',
      updatedAt: '2024-09-01T00:00:00',
    });
  });

  it('should build an Menu Entity Object with overridden name', () => {
    const menuEntity = menuEntityFactory.build({ name: 'New Menu Name' });
    expect(menuEntity.name).toBe('New Menu Name');
  });
});
