/**
 * Decodes a base64 string, interpreting it as utf-8.
 *
 * @param base64 - The base64 string to decode.
 * @returns The decoded string.
 */
export const decodeBase64 = (base64: string) => {
  const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
  return new TextDecoder('utf-8').decode(bytes);
};
