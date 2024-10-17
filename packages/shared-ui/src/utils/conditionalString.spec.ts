import { conditionalStrings } from './conditionalStrings';

describe('conditionalStrings', () => {
  it('should return the keys if the values are true', () => {
    const str = conditionalStrings({
      foo: true,
      abc: true,
      bar: true,
    });
    expect(str).toBe('foo abc bar');
  });

  it('should return only the keys if the values are a mixture of true/false', () => {
    const str = conditionalStrings({
      foo: true,
      abc: false,
      bar: true,
    });
    expect(str).toBe('foo bar');
  });

  it('should not return spaces when bools are all false', () => {
    const str = conditionalStrings({
      foo: false,
      abc: false,
      bar: false,
    });
    expect(str).toBe('');
  });

  it('should ignore keys that are whitespace', () => {
    const str = conditionalStrings({
      foo: true,
      abc: false,
      '  ': true,
      '    ': true,
      bar: true,
    });
    expect(str).toBe('foo bar');
  });
});
