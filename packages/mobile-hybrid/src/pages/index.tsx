import { NextPage } from 'next';
import { useCallback, useEffect, useRef } from 'react';
import InvokeNativeAPICall from '@/invoke/apiCall';
import ListPanel from '@/components/ListPanel/ListPanel';
import { NewsList, NewsPreview } from '@/modules/news';
import { newsPanelStore } from '@/modules/news/store';
import InvokeNativeAnalytics from '@/invoke/analytics';
import trackScrollDepth from '@/utils/scrollDepth';
import Offers from '@/modules/offers';
import PromoBanner from '@/modules/promobanner';
import InvokeNativeNavigation from '@/invoke/navigation';
import Search from '@/components/Search/Search';
import PopularBrandsSlider from '@/modules/popularbrands';
import FavouritedBrandsSlider from '@/modules/favouritedbrands';
import useFavouritedBrands from '@/hooks/useFavouritedBrands';
import { useOnResume } from '@/hooks/useAppLifecycle';
import { APIUrl } from '@/globals';
import { AmplitudeEvents } from '@/utils/amplitude/amplitudeEvents';
import { Experiments } from '@/components/AmplitudeProvider/amplitudeKeys';
import Amplitude from '@/components/Amplitude/Amplitude';
import { useAmplitude } from '@/hooks/useAmplitude';
import {
  AmplitudeExperimentState,
  AmplitudeFeatureFlagState,
} from '@/components/AmplitudeProvider/types';
import { useAtom } from 'jotai';

const apiCall = new InvokeNativeAPICall();
const navigation = new InvokeNativeNavigation();
const analytics = new InvokeNativeAnalytics();

const Home: NextPage<any> = () => {
  const brands = useFavouritedBrands();
  const { is } = useAmplitude();
  const [seeAllNews, setSeeAllNews] = useAtom(newsPanelStore);
  const showFavouritedBrands =
    brands.length > 0 && is(Experiments.FAVOURITED_BRANDS, AmplitudeFeatureFlagState.On);
  const bodyHeight = useRef<HTMLElement>(null);

  const request = useCallback(() => {
    const homePageServices = [APIUrl.News, APIUrl.FavouritedBrands, APIUrl.OfferPromos];
    homePageServices.forEach((url) => {
      apiCall.requestData(url);
    });
  }, []);

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
        <div className="my-2 mx-2">
          <Search
            onSearch={(searchTerm) =>
              navigation.navigate(
                `/offers.php?type=1&opensearch=1&search=${encodeURIComponent(searchTerm)}`,
              )
            }
            placeholderText="Search stores or brands"
          />
        </div>
        <PromoBanner />
        {showFavouritedBrands && <FavouritedBrandsSlider />}
        {is(Experiments.POPULAR_OFFERS, AmplitudeExperimentState.Treatment) &&
          !showFavouritedBrands && <PopularBrandsSlider />}
        <Offers />
        <Amplitude keyName={Experiments.STREAMLINED_HOMEPAGE} value={AmplitudeFeatureFlagState.On}>
          <NewsPreview />
        </Amplitude>
      </div>
      <ListPanel visible={seeAllNews} onClose={seeAllClick}>
        {seeAllNews && <NewsList />}
      </ListPanel>
    </main>
  );
};

export default Home;
