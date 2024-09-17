import { OfferKeyBuilders } from './OfferEntity';

describe('Offer Entity Key Builders', () => {
  it('should build partition key', () => {
    const result = OfferKeyBuilders.buildPartitionKey('1');

    expect(result).toBe('OFFER-1');
  });

  it('should build sort key', () => {
    const result = OfferKeyBuilders.buildSortKey('1');

    expect(result).toBe('COMPANY-1');
  });

  it('should build gsi1 partition key', () => {
    const result = OfferKeyBuilders.buildGsi1PartitionKey(false);

    expect(result).toBe('LOCAL-false');
  });

  it('should build gsi1 sort key', () => {
    const result = OfferKeyBuilders.buildGsi1SortKey(false);

    expect(result).toBe('LOCAL-false');
  });

  it('should build gsi2 partition key', () => {
    const result = OfferKeyBuilders.buildGsi2PartitionKey('1');

    expect(result).toBe('COMPANY-1');
  });

  it('should build gsi2 sort key', () => {
    const result = OfferKeyBuilders.buildGsi2SortKey('1');

    expect(result).toBe('OFFER-1');
  });
});
