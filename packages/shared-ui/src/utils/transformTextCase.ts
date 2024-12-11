export enum TextCase {
  CAPS_FIRST_LETTER,
  CAPS_FIRST_LETTER_ONLY,
  WITHOUT_UNDERSCORES,
}

export const transformTextCase = (text: string, textCase: TextCase): string => {
  if (!text) return '';

  switch (textCase) {
    case TextCase.CAPS_FIRST_LETTER:
      return text[0].toUpperCase() + text.slice(1);
    case TextCase.CAPS_FIRST_LETTER_ONLY:
      return text[0].toUpperCase() + text.slice(1).toLowerCase();
    case TextCase.WITHOUT_UNDERSCORES:
      return text.replace(/_/g, ' ');
  }
};

export const transformTextCases = (originalText: string, textCases: Array<TextCase>) => {
  let transformedText = originalText;

  textCases.forEach((textCase) => {
    transformedText = transformTextCase(transformedText, textCase);
  });

  return transformedText;
};
