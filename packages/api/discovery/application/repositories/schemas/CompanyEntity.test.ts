import { CompanyKeyBuilders } from '@blc-mono/discovery/application/repositories/schemas/CompanyEntity';

describe('Company Entity Key Builders', () => {
  it('should build partition key', () => {
    const result = CompanyKeyBuilders.buildPartitionKey('1');

    expect(result).toBe('COMPANY-1');
  });

  it('should build sort key', () => {
    const result = CompanyKeyBuilders.buildSortKey('1');

    expect(result).toBe('COMPANY-1');
  });
});
