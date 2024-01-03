declare module 'pkcs7' {
  export const VERSION: string;
  export function pad(data: Uint8Array): Uint8Array;
  export function unpad(data: Uint8Array): Uint8Array;
}
