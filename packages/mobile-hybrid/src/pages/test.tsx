import Head from 'next/head';
import { NextPage } from 'next';
import Search from '@/components/Search/Search';
import InvokeNativeNavigation from '@/invoke/navigation';
import PopularBrandsSlider from '@/modules/popularbrands';
import BannerCarousel from '@/components/Banner/BannerCarousel';

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
      {/* <BannerCarousel
        slides={[
          {
            id: 1,
            text: 'Test',
            imageSrc: 'emma.png',
          },
          {
            id: 1,
            text: 'this is a long tile that should be truncated if it gets too long for the screen',
            imageSrc: 'iceland.png',
          },
          {
            id: 1,
            text: 'Test',
            imageSrc: 'emma.png',
          },
          {
            id: 1,
            text: 'Test',
            imageSrc: 'emma.png',
          },
          {
            id: 1,
            text: 'Test',
            imageSrc: 'emma.png',
          },
          {
            id: 1,
            text: 'Test',
            imageSrc: 'emma.png',
          },
          {
            id: 1,
            text: 'Test',
            imageSrc: 'emma.png',
          },
          {
            id: 1,
            text: 'Test',
            imageSrc: 'emma.png',
          },
        ]}
      /> */}
      <PopularBrandsSlider />
    </>
  );
};

export default TestPage;
