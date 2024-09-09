import { boostFactory } from './BoostFactory';

describe('Boost Factory', () => {
  it('should build a default Boost object', () => {
    const boost = boostFactory.build();
    expect(boost).toEqual({
      type: 'boost',
      boostStart: '2024-09-01',
      boostEnd: '2024-09-30',
      updatedAt: '2024-09-01T00:00:00',
    });
  });

  it('should build a Boost object with overridden type', () => {
    const boost = boostFactory.build({ type: 'premium-boost' });
    expect(boost.type).toBe('premium-boost');
  });
});
