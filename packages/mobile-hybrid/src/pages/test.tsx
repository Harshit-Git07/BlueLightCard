import Head from 'next/head';
import { NextPage } from 'next';
import Search from '@/components/Search/Search';
import InvokeNativeNavigation from '@/invoke/navigation';
// import BannerCarousel from '@/components/Banner/BannerCarousel';
// import NewsLayout from '@/modules/news/components/NewsLayout/NewsLayout';
// import { NewsModuleStore } from '@/modules/news/store';
// import useNews from '@/hooks/useNews';
// import { useContext } from 'react';
import Heading from '@/components/Heading/Heading';

const navigation = new InvokeNativeNavigation();
const TestPage: NextPage<any> = () => {
  // const { setSeeAllNews } = useContext(NewsModuleStore);
  // const news = useNews();
  // const previewNews = news.slice(0, 3);
  // function onSeeAllClick(): void {
  //   throw new Error('Function not implemented.');
  // }

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
            text: 'this is not the title of this image, but it is a very long title, and it is even longer than the previous one',
            imageSrc: 'emma.png',
          },
          {
            id: 1,
            text: 'this is not the title of this image, but it is a very long title, and it is even longer than the previous one, and it is even longer than the previous one',
            imageSrc: 'code_mac.jpg',
          },
          {
            id: 1,
            text: 'this is the tile',
            imageSrc: 'iceland.png',
          },
          {
            id: 1,
            text: 'this is not the title of this image, but it is a very long title',
            imageSrc: 'toolstation.png',
          },
          {
            id: 1,
            text: 'this is not the title of this image, but it is a very long title, and it is even longer than the previous one',
            imageSrc: 'emma.png',
          },
          {
            id: 1,
            text: 'this is not the title of this image, but it is a very long title, and it is even longer than the previous one, and it is even longer than the previous one',
            imageSrc: 'code_mac.jpg',
          },
          {
            id: 1,
            text: 'this is the tile',
            imageSrc: 'iceland.png',
          },
          {
            id: 1,
            text: 'this is not the title of this image, but it is a very long title',
            imageSrc: 'toolstation.png',
          },
          {
            id: 1,
            text: 'this is not the title of this image, but it is a very long title, and it is even longer than the previous one',
            imageSrc: 'emma.png',
          },
          {
            id: 1,
            text: 'this is not the title of this image, but it is a very long title, and it is even longer than the previous one, and it is even longer than the previous one',
            imageSrc: 'code_mac.jpg',
          },
          {
            id: 1,
            text: 'this is the tile',
            imageSrc: 'iceland.png',
          },
          {
            id: 1,
            text: 'this is not the title of this image, but it is a very long title',
            imageSrc: 'toolstation.png',
          },
          {
            id: 1,
            text: 'this is not the title of this image, but it is a very long title, and it is even longer than the previous one',
            imageSrc: 'emma.png',
          },
          {
            id: 1,
            text: 'this is not the title of this image, but it is a very long title, and it is even longer than the previous one, and it is even longer than the previous one',
            imageSrc: 'code_mac.jpg',
          },
        ]}
      />
      <Heading title="Latest news" />
      <NewsLayout
        news={[
          {
            image: 'news1.jpg',
            title: 'this is the title alsflj slfj alsjsljfl sajfals jf',
            nid: 1,
            newsId: '123',
            s3image: 'news1.jpg',
            body: 'this is the body',
            when: 'Fri 12 Sep, 2021',
          },
          {
            image: 'news2.jpg',
            title: 'this is the title, which is longer.',
            nid: 1,
            newsId: '123',
            s3image: 'news2.jpg',
            body: 'this is the body, which is longer.',
            when: '12-09-2021',
          },
          {
            image: 'news3.jpg',
            title: 'this is the title',
            nid: 1,
            newsId: '123',
            s3image: 'news3.jpg',
            body: 'this is the body',
            when: '2021-10-02',
          },
        ]}
        showHeading={false}
        onArticleClick={(articleId) =>
          navigation.navigate(`/bluelightcardnewsdetails.php?id=${articleId}`)
        }
      /> */}
    </>
  );
};

export default TestPage;
