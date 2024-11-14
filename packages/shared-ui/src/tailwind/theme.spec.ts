import { getInputBorderClasses } from './theme';
import { borders } from './theme';

describe('getInputBorderClasses', () => {
  it('returns the disabled border class when isDisabled is true', () => {
    expect(getInputBorderClasses(true, false, undefined)).toBe(borders.disabled);
    expect(getInputBorderClasses(true, true, true)).toBe(borders.disabled);
  });

  it('returns the default border class when isFocused is false and isDisabled is false', () => {
    expect(getInputBorderClasses(false, false, true)).toBe(borders.default);
    expect(getInputBorderClasses(false, false, false)).toBe(borders.default);
    expect(getInputBorderClasses(false, false, undefined)).toBe(borders.default);
  });

  it('returns the active border class when isFocused is true, isDisabled is false, and isValid is true', () => {
    expect(getInputBorderClasses(false, true, true)).toBe(borders.active);
  });

  it('returns the active border class when isFocused is true, isDisabled is false, and isValid is undefined (not yet validated)', () => {
    expect(getInputBorderClasses(false, true, undefined)).toBe(borders.active);
  });

  it('returns the error border class when isFocused is true, isDisabled is false, and isValid is false', () => {
    expect(getInputBorderClasses(false, true, false)).toBe(borders.error);
  });
});
