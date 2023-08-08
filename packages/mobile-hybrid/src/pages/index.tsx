import { NextPage } from 'next';
import { useEffect, useRef, useContext } from 'react';
import InvokeNativeAPICall from '@/invoke/apiCall';
import ListPanel from '@/components/ListPanel/ListPanel';
import { NewsList, NewsPreview } from '@/modules/news';
import { NewsModuleStore } from '@/modules/news/store';
import InvokeNativeAnalytics from '@/invoke/analytics';
import trackScrollDepth from '@/utils/scrollDepth';
import Offers from '@/modules/offers';

const apiCall = new InvokeNativeAPICall();
const analytics = new InvokeNativeAnalytics();

const Home: NextPage<any> = () => {
  const { seeAllNews, setSeeAllNews } = useContext(NewsModuleStore);
  const bodyHeight = useRef<HTMLElement>(null);

  const seeAllClick = () => {
    document.getElementById('app-body')?.classList.remove('noscroll');
    setSeeAllNews(false);
  };

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
    apiCall.requestData('/api/4/offer/promos_new.php');
    apiCall.requestData('/api/4/news/list.php');
  }, []);

  return (
    <main>
      <div className="mb-2">
        <NewsPreview />
        <Offers />
      </div>
      <ListPanel visible={seeAllNews} onClose={seeAllClick}>
        {seeAllNews && <NewsList />}
      </ListPanel>
    </main>
  );
};

export default Home;
