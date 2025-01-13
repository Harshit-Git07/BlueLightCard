import { TextCase, transformTextCase, transformTextCases } from './transformTextCase';

describe('transformTextCase', () => {
  describe('CAPS_FIRST_LETTER', () => {
    it('should capitalize only the first letter of the text when TextCase.CAPS_FIRST_LETTER is passed', () => {
      const inputText = 'hello world';
      const result = transformTextCase(inputText, TextCase.CAPS_FIRST_LETTER);

      expect(result).toBe('Hello world');
    });

    it('should return an empty string when input text is empty', () => {
      const result = transformTextCase('', TextCase.CAPS_FIRST_LETTER);

      expect(result).toBe('');
    });

    it('should return the same string if the input text is already capitalized', () => {
      const inputText = 'Hello world';
      const result = transformTextCase(inputText, TextCase.CAPS_FIRST_LETTER);

      expect(result).toBe('Hello world');
    });

    it('should ignore any other capitalisation', () => {
      const inputText = 'hElLo WoRlD';
      const result = transformTextCase(inputText, TextCase.CAPS_FIRST_LETTER);

      expect(result).toBe('HElLo WoRlD');
    });
  });

  describe('CAPS_FIRST_LETTER_ONLY', () => {
    it('capitalises the first letter', () => {
      const inputText = 'hello world';
      const result = transformTextCase(inputText, TextCase.CAPS_FIRST_LETTER_ONLY);

      expect(result).toBe('Hello world');
    });

    it('lowercases the other letters', () => {
      const inputText = 'HELLO WORLD';
      const result = transformTextCase(inputText, TextCase.CAPS_FIRST_LETTER_ONLY);

      expect(result).toBe('Hello world');
    });

    it('survives empty input', () => {
      const inputText = '';
      const result = transformTextCase(inputText, TextCase.CAPS_FIRST_LETTER_ONLY);

      expect(result).toBe('');
    });
  });

  describe('WITHOUT_UNDERSCORES', () => {
    it('removes underscores', () => {
      const inputText = 'hello_world';
      const result = transformTextCase(inputText, TextCase.WITHOUT_UNDERSCORES);

      expect(result).toBe('hello world');
    });

    it('survives empty input', () => {
      const inputText = '';
      const result = transformTextCase(inputText, TextCase.CAPS_FIRST_LETTER_ONLY);

      expect(result).toBe('');
    });
  });
});

describe('transformTextCases', () => {
  it('performs operations sequentially', () => {
    const inputText = 'HELLO_WORLD';
    const result = transformTextCases(inputText, [
      TextCase.WITHOUT_UNDERSCORES,
      TextCase.CAPS_FIRST_LETTER_ONLY,
    ]);

    expect(result).toBe('Hello world');
  });
});
