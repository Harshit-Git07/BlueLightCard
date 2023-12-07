import Head from 'next/head';
import { NextPage } from 'next';
import Search from '@/components/Search/Search';
import InvokeNativeNavigation from '@/invoke/navigation';
import RecentSearchButton from '@/components/RecentSearchButton/RecentSearchButton';
import Filter from '@/components/Filter/Filter';
import ListItem from '@/components/ListItem/ListItem';
import FilterPillButton from '@/components/FilterPillButton/FilterPillButton';

const navigation = new InvokeNativeNavigation();
const TestPage: NextPage<any> = () => {
  return (
    <div className="m-2">
      <Head>
        <title>Mobile Hybrid</title>
        <meta name="description" />
      </Head>

      <Search
        placeholderText="Search"
        onBackButtonClick={() => console.log('Gone back')}
        onSearch={(searchTerm) =>
          navigation.navigate(
            `/offers.php?type=1&opensearch=1&search=${encodeURIComponent(searchTerm)}`,
          )
        }
      />
      <Filter
        filterCount={0}
        onPress={function (): void {
          throw new Error('Function not implemented.');
        }}
      />
      <Filter
        filterCount={2}
        onPress={function (): void {
          throw new Error('Function not implemented.');
        }}
      />
      <RecentSearchButton text="nike" onPress={() => console.log('Pressed')} />
      <RecentSearchButton text="new look" onPress={() => console.log('Pressed')} />
      <RecentSearchButton text="jd sports" onPress={() => console.log('Pressed')} />
      <RecentSearchButton text="jd sports" onPress={() => console.log('Pressed')} />
      <ListItem title="Offer Description" text="Supporting Info" imageSrc="card_test_img.jpg" />

      <FilterPillButton
        pills={[
          {
            text: 'Filter Item 1',
            value: '1',
          },
          {
            text: 'Filter 2',
            value: '2',
          },
          {
            text: 'Filter Item 2',
            value: '3',
          },
          {
            text: 'Filter Item 4',
            value: '4',
          },
        ]}
      />
    </div>
  );
};

export default TestPage;
