import Head from 'next/head';
import { NextPage } from 'next';
import Search from '@/components/Search/Search';
import InvokeNativeNavigation from '@/invoke/navigation';
import Heading from '@/components/Heading/Heading';
import PopularBrandsSlider from '@/modules/popularbrands';

const navigation = new InvokeNativeNavigation();
const TestPage: NextPage<any> = () => {
  return (
    <>
      <Head>
        <title>Mobile Hybrid</title>
        <meta name="description" />
      </Head>
      <Search
        onSearch={(searchTerm) =>
          navigation.navigate(
            `/offers.php?type=1&opensearch=1&search=${encodeURIComponent(searchTerm)}`,
          )
        }
      />
      <PopularBrandsSlider />
    </>
  );
};

export default TestPage;
