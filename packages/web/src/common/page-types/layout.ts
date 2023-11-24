import { NextPage } from 'next';
import { JSXElementConstructor, ReactElement, ReactNode } from 'react';

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (
    page: ReactElement
  ) =>
    | ReactElement<any, string | JSXElementConstructor<any>>
    | ReactElement<any, string | JSXElementConstructor<any>>[];
};
