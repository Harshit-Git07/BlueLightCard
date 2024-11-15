import { getAriaDescribedBy } from './getAriaDescribedBy';

describe('getAriaDescribedBy', () => {
  const componentId = 'test-component';

  it('returns an empty string when all parameters are undefined', () => {
    const result = getAriaDescribedBy(componentId, undefined, undefined, undefined, undefined);
    expect(result).toBe('');
  });

  it('returns only the tooltip ID when only tooltip is defined', () => {
    const result = getAriaDescribedBy(componentId, 'Tooltip', undefined, undefined, undefined);
    expect(result).toBe(`${componentId}-tooltip`);
  });

  it('returns only the description ID when only description is defined', () => {
    const result = getAriaDescribedBy(componentId, undefined, 'Description', undefined, undefined);
    expect(result).toBe(`${componentId}-description`);
  });

  it('returns only the placeholder ID when only placeholder is defined', () => {
    const result = getAriaDescribedBy(componentId, undefined, undefined, 'Placeholder', undefined);
    expect(result).toBe(`${componentId}-placeholder`);
  });

  it('returns only the validation message ID when only validation message is defined', () => {
    const result = getAriaDescribedBy(componentId, undefined, undefined, undefined, 'Validation');
    expect(result).toBe(`${componentId}-validation-message`);
  });

  it('returns multiple IDs joined by spaces when multiple parameters are defined', () => {
    const result = getAriaDescribedBy(
      componentId,
      'Tooltip text',
      'Description text',
      undefined,
      'Validation message',
    );
    expect(result).toBe(
      `${componentId}-tooltip ${componentId}-description ${componentId}-validation-message`,
    );
  });

  it('does not include IDs for undefined parameters', () => {
    const result = getAriaDescribedBy(
      componentId,
      undefined,
      'Description text',
      undefined,
      undefined,
    );
    expect(result).toBe(`${componentId}-description`);
  });

  it('returns all IDs when all parameters are defined', () => {
    const result = getAriaDescribedBy(
      componentId,
      'Tooltip text',
      'Description text',
      'Placeholder text',
      'Validation message',
    );
    expect(result).toBe(
      `${componentId}-tooltip ${componentId}-description ${componentId}-placeholder ${componentId}-validation-message`,
    );
  });
});
