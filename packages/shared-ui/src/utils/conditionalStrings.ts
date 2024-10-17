export const conditionalStrings = (input: Record<string, boolean>): string => {
  return Object.entries(input)
    .filter(([key, conditional]) => conditional && key.trim() !== '')
    .map(([key]) => key.trim())
    .join(' ')
    .trim();
};
