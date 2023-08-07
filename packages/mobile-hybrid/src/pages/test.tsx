import Head from 'next/head';
import { NextPage } from 'next';
import BannerCarousel from '@/components/Banner/BannerCarousel';
import ExploreLink from '@/components/ExploreLink/ExploreLink';
import {
  faTag,
  faCompass,
  faGiftCard,
  faThumbsUp,
  faAward,
  faSignsPost,
} from '@fortawesome/pro-light-svg-icons';

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
      <ExploreLink icon={faTag} title={'High Street'} />
      <ExploreLink icon={faCompass} title={'Online'} />
      <ExploreLink icon={faGiftCard} title={'Giftcards'} />
      <ExploreLink icon={faThumbsUp} title={'Popular'} />
      <ExploreLink icon={faAward} title={'Featured'} />
      <ExploreLink icon={faSignsPost} title={'Local Services'} />
    </>
  );
};

export default TestPage;
