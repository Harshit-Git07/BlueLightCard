import Head from 'next/head';
import { NextPage } from 'next';
import SearchModule from '@/modules/search';
import { SearchVariant } from '@/modules/search/types';
// import FilterHeader from '@/components/FilterHeader/FilterHeader';
// import FilterPillButton from '@/components/FilterPillButton/FilterPillButton';
import Search from '@/components/Search/Search';
import RecentSearchButton from '@/components/RecentSearchButton/RecentSearchButton';
import ListItem from '@/components/ListItem/ListItem';

const TestPage: NextPage<any> = () => {
  return (
    <div className="">
      <Head>
        <title>Mobile Hybrid</title>
        <meta name="description" />
      </Head>

      <SearchModule
        variant={SearchVariant.Primary}
        placeholder="Search for offers"
        showFilterButton={true}
      />

      {/* <Search onSearch={(searchTerm) => console.log(searchTerm)} />
      <FilterHeader
        onResetClick={function (): void {
          throw new Error('Function not implemented.');
        }}
        onDoneClick={function (): void {
          throw new Error('Function not implemented.');
        }}
        resetEnabled={true}
      />
      <FilterPillButton
        pills={[
          {
            text: 'Online',
            value: '1',
          },
          {
            text: 'High Street',
            value: '2',
          },
          {
            text: 'Gift Card',
            value: '3',
          },
          {
            text: 'Local',
            value: '4',
          },
        ]}
      />
      <RecentSearchButton onPress={() => console.log('Recent')} text={'nike'} />
      <RecentSearchButton onPress={() => console.log('Recent')} text={'jd sports'} />
      <RecentSearchButton onPress={() => console.log('Recent')} text={'new look'} />
      <ListItem imageSrc="news1.jpg" title="Nike" text="Sportswear" /> */}
      {/* <FilterPillButton
        pills={[
          {
            text: 'Online',
            value: '1',
          },
          {
            text: 'High Street',
            value: '2',
          },
          {
            text: 'Gift Card',
            value: '3',
          },
          {
            text: 'Local',
            value: '4',
          },
        ]}
      /> */}
    </div>
  );
};

export default TestPage;
