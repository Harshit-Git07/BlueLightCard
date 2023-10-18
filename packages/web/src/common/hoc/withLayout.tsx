import generateBaseLayout from '@/layouts/BaseLayout/generateBaseLayout';
import { NextPageWithLayout } from '@/page-types/layout';
import { NextPage } from 'next';
import React from 'react';

const withLayout = (content: React.FC<any> | NextPage<any>, props?: any) => {
  const Page: NextPageWithLayout<any> = () => {
    const Content = content;

    return <Content />;
  };

  Page.getLayout = generateBaseLayout(props);

  return Page;
};

export default withLayout;
