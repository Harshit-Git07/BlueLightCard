import { NextPage } from 'next';
import { useCallback, useContext, useEffect, useRef } from 'react';
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
import { AppContext } from '@/store';
import PopularBrandsSlider from '@/modules/popularbrands';
import FavouritedBrandsSlider from '@/modules/favouritedbrands';
import useFavouritedBrands from '@/hooks/useFavouritedBrands';
import { useOnResume } from '@/hooks/useAppLifecycle';
import { APIUrl } from '@/globals';
import { AmplitudeEvents } from '@/utils/amplitude/amplitudeEvents';
import { Experiments } from '@/components/AmplitudeProvider/amplitudeKeys';

const apiCall = new InvokeNativeAPICall();
const navigation = new InvokeNativeNavigation();
const analytics = new InvokeNativeAnalytics();

const Home: NextPage<any> = () => {
  const brands = useFavouritedBrands();
  const { seeAllNews, setSeeAllNews } = useContext(NewsModuleStore);
  const { experiments: expr, apiData } = useContext(AppContext);
  const showFavouritedBrands = brands.length > 0 && expr[Experiments.FAVOURITED_BRANDS] === 'on';
  const bodyHeight = useRef<HTMLElement>(null);

  const request = useCallback(() => {
    const homePageServices = [APIUrl.News, APIUrl.FavouritedBrands, APIUrl.OfferPromos];
    homePageServices.forEach((url) => {
      if (!apiData[url]) {
        apiCall.requestData(url);
      }
    });
  }, [apiData]);

  const seeAllClick = () => {
    document.getElementById('app-body')?.classList.remove('noscroll');
    setSeeAllNews(false);
  };

  useEffect(() => {
    if (bodyHeight.current) {
      trackScrollDepth(bodyHeight.current, (depth) => {
        analytics.logAnalyticsEvent({
          event: AmplitudeEvents.HOMEPAGE_VIEWED,
          parameters: {
            'scroll_depth_(%)': depth,
          },
        });
      });
    }
  }, []);

  useEffect(() => {
    request();
  }, [request]);

  useOnResume(request);

  return (
    <main ref={bodyHeight}>
      <div className="mb-9">
        {expr[Experiments.HOMEPAGE_SEARCHBAR] === 'treatment' && (
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
        {expr[Experiments.POPULAR_OFFERS] === 'treatment' && !showFavouritedBrands && (
          <PopularBrandsSlider />
        )}
        <Offers />
        {expr[Experiments.STREAMLINED_HOMEPAGE] === 'on' && <NewsPreview />}
      </div>
      <ListPanel visible={seeAllNews} onClose={seeAllClick}>
        {seeAllNews && <NewsList />}
      </ListPanel>
    </main>
  );
};

export default Home;
