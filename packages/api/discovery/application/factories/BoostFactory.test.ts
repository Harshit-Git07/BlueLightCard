import { boostFactory } from './BoostFactory';

describe('Boost Factory', () => {
  it('should build a default Boost object', () => {
    const boost = boostFactory.build();
    expect(boost).toEqual({
      type: 'boost',
      boosted: false,
    });
  });

  it('should build a Boost object with overridden type', () => {
    const boost = boostFactory.build({ type: 'premium-boost' });
    expect(boost.type).toBe('premium-boost');
  });
});
