import { discountFactory } from './DiscountFactory';

describe('Discount Factory', () => {
  it('should build a default Discount object', () => {
    const discount = discountFactory.build();
    expect(discount).toEqual({
      type: 'Percentage off',
      description: 'Other',
      coverage: 'All Site',
      updatedAt: '2024-09-01T00:00:00',
    });
  });

  it('should build a Discount object with overridden type', () => {
    const discount = discountFactory.build({ type: 'Fixed amount' });
    expect(discount.type).toBe('Fixed amount');
  });
});
