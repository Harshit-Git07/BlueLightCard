import { transformTextCase, TextCase } from './transformTextCase';

describe('transformTextCase', () => {
  it('should capitalize only the first letter of the text when TextCase.CAPS_FIRST_LETTER_ONLY is passed', () => {
    const inputText = 'hello world';
    const result = transformTextCase(inputText, TextCase.CAPS_FIRST_LETTER_ONLY);

    expect(result).toBe('Hello world');
  });

  it('should return an empty string when input text is empty', () => {
    const result = transformTextCase('', TextCase.CAPS_FIRST_LETTER_ONLY);

    expect(result).toBe('');
  });

  it('should return the same string if the input text is already capitalized', () => {
    const inputText = 'Hello world';
    const result = transformTextCase(inputText, TextCase.CAPS_FIRST_LETTER_ONLY);

    expect(result).toBe('Hello world');
  });
});
