import { marketplaceFactory, marketplaceMenuFactory } from './MarketplaceFactory';

describe('MarketplaceMenu Factory', () => {
  it('should build a default MarketplaceMenu object', () => {
    const menu = marketplaceMenuFactory.build();
    expect(menu).toEqual({
      name: 'Sample Marketplace Menu',
      image: 'https://cdn.bluelightcard.co.uk/offerimages/1724052659175.jpg',
      offers: [1, 2, 3],
      updatedAt: '2024-09-01T00:00:00',
    });
  });

  it('should build a MarketplaceMenu object with overridden name', () => {
    const menu = marketplaceMenuFactory.build({ name: 'New Marketplace Menu' });
    expect(menu.name).toBe('New Marketplace Menu');
  });
});

describe('Marketplace Factory', () => {
  it('should build a default Marketplace object', () => {
    const marketplace = marketplaceFactory.build();
    expect(marketplace).toEqual({
      name: 'Sample Marketplace',
      menus: expect.any(Array),
      startTime: '2024-09-01T00:00:00',
      endTime: '2024-09-30T23:59:59',
      updatedAt: '2024-09-01T00:00:00',
    });
  });

  it('should build a Marketplace object with overridden name', () => {
    const marketplace = marketplaceFactory.build({ name: 'New Marketplace' });
    expect(marketplace.name).toBe('New Marketplace');
  });
});
