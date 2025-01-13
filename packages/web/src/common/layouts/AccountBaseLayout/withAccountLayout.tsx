import { NextPage } from 'next';
import { NextPageWithLayout } from '../../page-types/layout';
import generateAccountBaseLayout from './generateAccountBaseLayout';
import { FC } from 'react';

const withAccountLayout = (content: FC<any> | NextPage<any>, props?: any) => {
  const Page: NextPageWithLayout<any> = () => {
    const Content = content;

    return <Content />;
  };

  Page.getLayout = generateAccountBaseLayout(props);

  return Page;
};

export default withAccountLayout;
