export function cleanText(text: string | null | undefined) {
  if (!text) return '';
  return text
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&pound;/g, '£');
}
