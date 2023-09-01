import Head from 'next/head';
import { NextPage } from 'next';
import Search from '@/components/Search/Search';
import InvokeNativeNavigation from '@/invoke/navigation';

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
    </>
  );
};

export default TestPage;
