import Head from 'next/head';
import { NextPage } from 'next';

const TestPage: NextPage<any> = () => {
  return (
    <div className="m-2">
      <Head>
        <title>Mobile Hybrid</title>
        <meta name="description" />
      </Head>
    </div>
  );
};

export default TestPage;
