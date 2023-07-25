import Head from 'next/head';
import { NextPage } from 'next';
import { useEffect } from 'react';
import InvokeNativeAPICall from '@/invoke/apiCall';

const apiCall = new InvokeNativeAPICall();

const Home: NextPage<any> = () => {
  useEffect(() => {
    apiCall.requestData('/api/4/offers/promos.php');
  }, []);
  return (
    <>
      <Head>
        <title>Mobile Hybrid</title>
        <meta name="description"/>
      </Head>
      <main className="">
        <h1 className="text-2xl font-semibold">Mobile Hybrid</h1>
        <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dolore at magnam quo ullam perferendis excepturi deleniti architecto recusandae aut soluta.</p>
      </main>
    </>
  );
};

export default Home;
