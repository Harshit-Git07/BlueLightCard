import { NextPage } from 'next';
import { useEffect, useRef, useContext } from 'react';
import InvokeNativeAPICall from '@/invoke/apiCall';
import ListPanel from '@/components/ListPanel/ListPanel';
import { NewsList, NewsPreview } from '@/modules/news';
import { NewsModuleStore } from '@/modules/news/store';
import InvokeNativeAnalytics from '@/invoke/analytics';
import trackScrollDepth from '@/utils/scrollDepth';

const apiCall = new InvokeNativeAPICall();
const analytics = new InvokeNativeAnalytics();

const Home: NextPage<any> = () => {
  const { seeAllNews, setSeeAllNews } = useContext(NewsModuleStore);
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
    <main>
      <div className="mb-2">
        <NewsPreview />
      </div>
      <ListPanel visible={seeAllNews} onClose={() => setSeeAllNews(false)}>
        {seeAllNews && <NewsList />}
      </ListPanel>
    </main>
  );
};

export default Home;
