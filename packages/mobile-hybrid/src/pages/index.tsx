import { NextPage } from 'next';
import { useEffect, useRef, useContext } from 'react';
import InvokeNativeAPICall from '@/invoke/apiCall';
import ListPanel from '@/components/ListPanel/ListPanel';
import { NewsList, NewsPreview } from '@/modules/news';
import { NewsModuleStore } from '@/modules/news/store';
import InvokeNativeAnalytics from '@/invoke/analytics';
import trackScrollDepth from '@/utils/scrollDepth';
import Offers from '@/modules/offers';
import ExploreLink from '@/components/ExploreLink/ExploreLink';
import {
  faTag,
  faCompass,
  faGiftCard,
  faThumbsUp,
  faAward,
  faSignsPost,
} from '@fortawesome/pro-light-svg-icons';
import PromoBanner from '@/modules/promobanner';
import Heading from '@/components/Heading/Heading';
import InvokeNativeNavigation from '@/invoke/navigation';

const apiCall = new InvokeNativeAPICall();
const navigation = new InvokeNativeNavigation();
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
      <div className="mb-9">
        <PromoBanner />
        <NewsPreview />
        <Offers />
        <Heading title="Explore" size="small" />
        <ExploreLink
          icon={faTag}
          title="High Street"
          onClick={() => navigation.navigate('/offers.php?type=5')}
        />
        <ExploreLink
          icon={faCompass}
          title="Online"
          onClick={() => navigation.navigate('/offers.php?type=0')}
        />
        <ExploreLink
          icon={faGiftCard}
          title="Giftcards"
          onClick={() => navigation.navigate('/offers.php?type=2')}
        />
        <ExploreLink
          icon={faThumbsUp}
          title="Popular"
          onClick={() => navigation.navigate('/offers.php?type=3')}
        />
        <ExploreLink
          icon={faAward}
          title="Featured"
          onClick={() => navigation.navigate('/offers.php?type=9')}
        />
        <ExploreLink
          icon={faSignsPost}
          title="Local Services"
          onClick={() => navigation.navigate('/offers.php?type=6')}
        />
      </div>
      <ListPanel visible={seeAllNews} onClose={seeAllClick}>
        {seeAllNews && <NewsList />}
      </ListPanel>
    </main>
  );
};

export default Home;
