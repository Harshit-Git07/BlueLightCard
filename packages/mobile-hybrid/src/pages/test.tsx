import Head from 'next/head';
import { NextPage } from 'next';
import Search from '@/components/Search/Search';

const TestPage: NextPage<any> = () => {
  return (
    <>
      <Head>
        <title>Mobile Hybrid</title>
        <meta name="description" />
      </Head>
      <Search onSearch={() => {}} />
      {/* //test comment */}
    </>
  );
};

export default TestPage;
