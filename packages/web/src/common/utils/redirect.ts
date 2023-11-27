import { NextRouter } from 'next/router';
export const redirect = (redirectURL: string, milliseconds: number, router: NextRouter) => {
  return new Promise<void>((resolve, reject) => {
    setTimeout(async () => {
      try {
        await router.push(redirectURL);
        resolve();
      } catch (error) {
        reject();
      }
    }, milliseconds);
  });
};
