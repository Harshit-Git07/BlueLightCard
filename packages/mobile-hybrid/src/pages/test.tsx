import Head from 'next/head';
import { NextPage } from 'next';
import FilterPanel from '@/modules/filterpanel';
import { useSetAtom } from 'jotai';
import { spinner } from '@/modules/Spinner/store';
import Spinner from '@/modules/Spinner';

const TestPage: NextPage<any> = () => {
  useSetAtom(spinner);

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
