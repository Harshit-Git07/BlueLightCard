import { NextPage } from 'next';
import { useEffect, useRef, useContext, useCallback } from 'react';
import InvokeNativeAPICall from '@/invoke/apiCall';
import ListPanel from '@/components/ListPanel/ListPanel';
import { NewsList, NewsPreview } from '@/modules/news';
import { NewsModuleStore } from '@/modules/news/store';
import InvokeNativeAnalytics from '@/invoke/analytics';
import trackScrollDepth from '@/utils/scrollDepth';
import Offers from '@/modules/offers';
import PromoBanner from '@/modules/promobanner';
import InvokeNativeNavigation from '@/invoke/navigation';
import LegacySearch from '@/components/LegacySearch/LegacySearch';
import InvokeNativeExperiment from '@/invoke/experiment';
import { AppContext } from '@/store';
import PopularBrandsSlider from '@/modules/popularbrands';
import FavouritedBrandsSlider from '@/modules/favouritedbrands';
import useFavouritedBrands from '@/hooks/useFavouritedBrands';
import { useOnResume } from '@/hooks/useAppLifecycle';
import { APIUrl } from '@/globals';

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
  }, [request]);

  useOnResume(request);

  return (
    <main ref={bodyHeight}>
      <div className="mb-9">
        {expr['homepage-searchbar'] === 'treatment' && (
          <LegacySearch
            onSearch={(searchTerm) =>
              navigation.navigate(
                `/offers.php?type=1&opensearch=1&search=${encodeURIComponent(searchTerm)}`,
                'home',
              )
            }
          />
        )}
        <PromoBanner />
        {showFavouritedBrands && <FavouritedBrandsSlider />}
        {expr['popular-offers'] === 'treatment' && !showFavouritedBrands && <PopularBrandsSlider />}
        <Offers />
        {expr['streamlined-homepage'] === 'on' && <NewsPreview />}
      </div>
      <ListPanel visible={seeAllNews} onClose={seeAllClick}>
        {seeAllNews && <NewsList />}
      </ListPanel>
    </main>
  );
};

export default Home;
