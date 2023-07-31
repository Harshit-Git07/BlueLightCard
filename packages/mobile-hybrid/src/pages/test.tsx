import Head from 'next/head';
import { NextPage } from 'next';
import CardCarousel from '@/components/Carousel/CardCarousel';

const slidesData = [
  {
    text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eveniet, ratione.',
    imageSrc: 'card_test_img.jpg',
    title: 'Slide 1 Title',
  },
  {
    text: 'Slide 2 description',
    imageSrc: 'code_mac.jpg',
    title: 'Slide 2 Title',
  },
  {
    text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eveniet, ratione.',
    imageSrc: 'codebase.jpg',
    title: 'Slide 2 Title',
  },
];
const TestPage: NextPage<any> = () => {
  return (
    <>
      <Head>
        <title>Mobile Hybrid</title>
        <meta name="description" />
      </Head>
      <div>
        <CardCarousel slides={slidesData} />
      </div>
    </>
  );
};

export default TestPage;
