export enum TextCase {
  CAPS_FIRST_LETTER_ONLY,
}

export const transformTextCase = (text: string, textCase: TextCase): string => {
  if (!text) return '';

  switch (textCase) {
    case TextCase.CAPS_FIRST_LETTER_ONLY:
      return text[0].toUpperCase() + text.slice(1);
  }
};
