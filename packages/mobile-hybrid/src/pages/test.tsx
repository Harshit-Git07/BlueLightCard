import Head from 'next/head';
import { NextPage } from 'next';
import ExploreLink from '@/components/ExploreLink/ExploreLink';
import {
  faTag,
  faCompass,
  faGiftCard,
  faThumbsUp,
  faAward,
  faSignsPost,
} from '@fortawesome/pro-light-svg-icons';

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
