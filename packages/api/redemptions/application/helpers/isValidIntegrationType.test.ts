import { isValidIntegrationType } from './isValidIntegrationType';

describe('UpdateRedemptionConfigService - isValidIntegrationType', () => {
  it('should return true when the integration type is valid', () => {
    const actual = isValidIntegrationType('eagleeye');
    expect(actual).toBe(true);
  });

  it('should return false when the integration type is invalid', () => {
    const actual = isValidIntegrationType('invalid');
    expect(actual).toBe(false);
  });

  it('should return false when the integration type is null', () => {
    const actual = isValidIntegrationType(null);
    expect(actual).toBe(false);
  });
});
