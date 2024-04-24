import { NextRouter } from 'next/router';
import { decodeBase64 } from '@/utils/base64';

export const redirectAndDecodeURL = (
  redirectURLBase64: string,
  milliseconds: number,
  router: NextRouter
) => {
  return new Promise<void>((resolve, reject) => {
    setTimeout(async () => {
      try {
        await router.push(decodeBase64(redirectURLBase64));
        resolve();
      } catch (error) {
        reject();
      }
    }, milliseconds);
  });
};
