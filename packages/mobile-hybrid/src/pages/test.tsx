import Head from 'next/head';
import { NextPage } from 'next';
import SearchModule from '@/modules/search';
import FilterPanel from '@/modules/filterpanel';
import BrowseCategories from '@/components/BrowseCategories/BrowseCategories';

const TestPage: NextPage<any> = () => {
  return (
    <div>
      <Head>
        <title>Mobile Hybrid</title>
        <meta name="description" />
      </Head>
      <SearchModule placeholder="Search for offers" />
      {/* <BrowseCategories /> */}
      <FilterPanel />
    </div>
  );
};

export default TestPage;
