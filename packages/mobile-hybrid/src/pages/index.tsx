import Head from 'next/head';
import { NextPage } from 'next';
import { useEffect, useContext } from 'react';
import InvokeNativeAPICall from '@/invoke/apiCall';
import { AppContext } from '@/store';

const apiCall = new InvokeNativeAPICall();

const Home: NextPage<any> = () => {
  const { apiData } = useContext(AppContext);

  useEffect(() => {
    apiCall.requestData('/api/4/offers/promos.php');
  }, []);

  return (
    <>
      <Head>
        <title>Mobile Hybrid</title>
        <meta name="description" />
      </Head>
      <main className="">
        <h1 className="text-2xl font-semibold">Mobile Hybrid</h1>
        <p>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dolore at magnam quo ullam
          perferendis excepturi deleniti architecto recusandae aut soluta.
        </p>
        <ul>
          {apiData['/api/4/offers/promos.php']?.promos.map((offer: any, idx: number) => (
            <li key={`${idx}_${offer.title}`}>{offer.title}</li>
          ))}
        </ul>
      </main>
    </>
  );
};

export default Home;
