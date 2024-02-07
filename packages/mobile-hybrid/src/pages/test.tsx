import Head from 'next/head';
import { NextPage } from 'next';
import SearchModule from '@/modules/search';
import { SearchVariant } from '@/modules/search/types';
import FilterPanel from '@/modules/filterpanel';
import BrowseCategories from '@/components/BrowseCategories/BrowseCategories';

const TestPage: NextPage<any> = () => {
  return (
    <div>
      <Head>
        <title>Mobile Hybrid</title>
        <meta name="description" />
      </Head>
      <SearchModule
        variant={SearchVariant.Primary}
        placeholder="Search for offers"
        showFilterButton={true}
      />
      {/* <BrowseCategories /> */}
      <FilterPanel />
    </div>
  );
};

export default TestPage;
