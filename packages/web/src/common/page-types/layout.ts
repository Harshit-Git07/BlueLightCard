import { NextPage } from 'next';
import { JSXElementConstructor, ReactElement } from 'react';

export type NextPageWithLayout<P = object, IP = P> = NextPage<P, IP> & {
  getLayout?: (
    page: ReactElement
  ) =>
    | ReactElement<any, string | JSXElementConstructor<any>>
    | ReactElement<any, string | JSXElementConstructor<any>>[];
};
