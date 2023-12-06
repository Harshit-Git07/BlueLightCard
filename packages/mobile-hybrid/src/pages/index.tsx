import { NextPage } from 'next';
import { useEffect, useRef, useContext, useCallback } from 'react';
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
import Search from '@/components/Search/Search';
import InvokeNativeExperiment from '@/invoke/experiment';
import { AppContext } from '@/store';
import PopularBrandsSlider from '@/modules/popularbrands';
import FavouritedBrandsSlider from '@/modules/favouritedbrands';
import useFavouritedBrands from '@/hooks/useFavouritedBrands';
import { useOnResume } from '@/hooks/useAppLifecycle';
import { APIUrl } from '@/hooks/useAPIData';

const apiCall = new InvokeNativeAPICall();
const navigation = new InvokeNativeNavigation();
const analytics = new InvokeNativeAnalytics();
const experiments = new InvokeNativeExperiment();

const Home: NextPage<any> = () => {
  const brands = useFavouritedBrands();
  const { seeAllNews, setSeeAllNews } = useContext(NewsModuleStore);
  const { experiments: expr, apiData } = useContext(AppContext);
  const showFavouritedBrands = brands.length > 0 && expr['favourited-brands'] === 'on';
  const bodyHeight = useRef<HTMLElement>(null);

  const request = useCallback(() => {
    Object.values(APIUrl).forEach((url) => {
      if (!apiData[url]) {
        apiCall.requestData(url);
      }
    });
    experiments.experiment([
      'homepage-searchbar',
      'non-exclusive-offers',
      'popular-offers',
      'favourited-brands',
      'streamlined-homepage',
      'favourite-subtitle',
    ]);
  }, [apiData]);

  const seeAllClick = () => {
    document.getElementById('app-body')?.classList.remove('noscroll');
    setSeeAllNews(false);
  };

  useEffect(() => {
    if (bodyHeight.current) {
      trackScrollDepth(bodyHeight.current, (depth) => {
        analytics.logAnalyticsEvent({
          event: 'homepage_viewed',
          parameters: {
            'scroll_depth_(%)': depth,
          },
        });
      });
    }

    request();
  }, []);

  useOnResume(request);

  return (
    <main ref={bodyHeight}>
      <div className="mb-9">
        {expr['homepage-searchbar'] === 'treatment' && (
          <Search
            placeholderText="Search"
            onSearch={(searchTerm) =>
              navigation.navigate(
                `/offers.php?type=1&opensearch=1&search=${encodeURIComponent(searchTerm)}`,
              )
            }
          />
        )}
        <PromoBanner />
        {showFavouritedBrands && <FavouritedBrandsSlider />}
        {expr['popular-offers'] === 'treatment' && !showFavouritedBrands && <PopularBrandsSlider />}
        <Offers />
        {expr['streamlined-homepage'] === 'on' && <NewsPreview />}
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
