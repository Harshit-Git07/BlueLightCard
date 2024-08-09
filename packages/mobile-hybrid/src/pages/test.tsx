import Head from 'next/head';
import { NextPage } from 'next';
import SearchModule from '@/modules/search';
import FilterPanel from '@/modules/filterpanel';
import { useEffect } from 'react';
import { useSetAtom } from 'jotai';
import { spinner } from '@/modules/Spinner/store';
import { Badge } from '@bluelightcard/shared-ui';
import Spinner from '@/modules/Spinner';

const TestPage: NextPage<any> = () => {
  const setSpinner = useSetAtom(spinner);

  // useEffect(() => {
  //   setSpinner(false);
  // }, []);

  return (
    <div>
      <Head>
        <title>Mobile Hybrid</title>
        <meta name="description" />
      </Head>
      <Spinner />
      {/* <BrowseCategories /> */}
      <FilterPanel />
    </div>
  );
};

export default TestPage;
