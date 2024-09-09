import { homepageMenuFactory } from './HomepageMenuFactory';

describe('HomepageMenu Factory', () => {
  it('should build a default HomepageMenu object', () => {
    const menu = homepageMenuFactory.build();
    expect(menu).toEqual({
      name: 'Sample Menu',
      offers: [1, 2, 3],
      startTime: '2024-09-01T00:00:00',
      endTime: '2024-09-30T23:59:59',
      updatedAt: '2024-09-01T00:00:00',
    });
  });

  it('should build a HomepageMenu object with overridden name', () => {
    const menu = homepageMenuFactory.build({ name: 'Custom Menu' });
    expect(menu.name).toBe('Custom Menu');
  });
});
