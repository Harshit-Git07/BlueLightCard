import { MenuOfferKeyBuilders } from '@blc-mono/discovery/application/repositories/schemas/MenuOfferEntity';

describe('Menu Offer Entity Key Builders', () => {
  it('should build partition key', () => {
    const result = MenuOfferKeyBuilders.buildPartitionKey('1');

    expect(result).toBe('MENU-1');
  });

  it('should build sort key', () => {
    const result = MenuOfferKeyBuilders.buildSortKey('1');

    expect(result).toBe('OFFER-1');
  });

  it('should build gsi1 partition key', () => {
    const result = MenuOfferKeyBuilders.buildGsi1PartitionKey('1');
    expect(result).toBe('MENU_TYPE-1');
  });

  it('should build the gsi1 sort key', () => {
    const result = MenuOfferKeyBuilders.buildGsi1SortKey('1');
    expect(result).toBe('MENU_TYPE-1');
  });

  it('should build gsi2 partition key', () => {
    const result = MenuOfferKeyBuilders.buildGsi2PartitionKey('1');
    expect(result).toBe('OFFER-1');
  });

  it('should build the gsi2 sort key', () => {
    const result = MenuOfferKeyBuilders.buildGsi2SortKey('1');
    expect(result).toBe('MENU-1');
  });
});
