/**
 *  decodes base64 string, firstly by creating bytes to avoid the unicode problem
 * @param base64
 */
export const decodeBase64 = (base64: string) => {
  const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
};
