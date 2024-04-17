import { NextRouter } from 'next/router';
import { decodeBase64 } from '@/utils/base64';

export const redirect = (redirectURL: string, milliseconds: number, router: NextRouter) => {
  return new Promise<void>((resolve, reject) => {
    setTimeout(async () => {
      try {
        await router.push(decodeBase64(redirectURL));
        resolve();
      } catch (error) {
        reject();
      }
    }, milliseconds);
  });
};
