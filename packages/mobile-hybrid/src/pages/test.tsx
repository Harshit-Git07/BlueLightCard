import Head from 'next/head';
import { NextPage } from 'next';
import BannerCarousel from '@/components/Banner/BannerCarousel';

const slidesData = [
  {
    text: 'Offer boost! Save 20% off full price online',
    imageSrc: 'card_test_img.jpg',
    title: 'Slide 1 Title',
  },
  {
    text: 'Extra 10% off everything',
    imageSrc: 'code_mac.jpg',
    title: 'Slide 2 Title',
  },
  {
    text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eveniet, ratione.',
    imageSrc: 'codebase.jpg',
    title: 'Slide 2 Title',
  },
  // Add more slide objects as needed
];
const TestPage: NextPage<any> = () => {
  return (
    <>
      <Head>
        <title>Mobile Hybrid</title>
        <meta name="description" />
      </Head>
      <div className="dark:bg-neutral-black max-h-[400px]">
        <BannerCarousel slides={slidesData} />
      </div>
    </>
  );
};

export default TestPage;
