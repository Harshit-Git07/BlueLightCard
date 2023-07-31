import Head from 'next/head';
import { NextPage } from 'next';
import { useEffect, useRef, useContext } from 'react';
import InvokeNativeAPICall from '@/invoke/apiCall';
import InvokeNativeAnalytics from '@/invoke/analytics';
import { AppContext } from '@/store';
import trackScrollDepth from '@/utils/scrollDepth';

const apiCall = new InvokeNativeAPICall();
const analytics = new InvokeNativeAnalytics();

const Home: NextPage<any> = () => {
  const { apiData } = useContext(AppContext);
  const bodyHeight = useRef<HTMLElement>(null);
  useEffect(() => {
    if (bodyHeight.current) {
      trackScrollDepth(bodyHeight.current, (depth) => {
        analytics.logAnalyticsEvent({
          event: 'Pageview: Mobile homepage',
          parameters: {
            'Scroll Depth (%)': depth,
          },
        });
      });
    }
    apiCall.requestData('/api/4/offers/promos.php');
  }, []);

  return (
    <>
      <Head>
        <title>Mobile Hybrid</title>
        <meta name="description" />
      </Head>
      <main ref={bodyHeight}>
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
