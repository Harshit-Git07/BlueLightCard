import { NextPage } from 'next';
import { useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import InvokeNativeAPICall from '@/invoke/apiCall';
import ListPanel from '@/components/ListPanel/ListPanel';
import { NewsList, NewsPreview } from '@/modules/news';
import { newsPanelStore } from '@/modules/news/store';
import InvokeNativeAnalytics from '@/invoke/analytics';
import trackScrollDepth from '@/utils/scrollDepth';
import Offers from '@/modules/offers';
import CampaignBanner from '@/components/CampaignBanner';
import type { CampaignEvent } from '@/components/CampaignBanner/types';
import PromoBanner from '@/modules/promobanner';
import { usePlatformAdapter } from '@bluelightcard/shared-ui';
import PopularBrandsSlider from '@/modules/popularbrands';
import { useOnResume } from '@/hooks/useAppLifecycle';
import { APIUrl, BRAND } from '@/globals';
import { AmplitudeEvents } from '@/utils/amplitude/amplitudeEvents';
import { useAtom, useAtomValue } from 'jotai';
import { userProfile } from '@/components/UserProfileProvider/store';
import { Experiments } from '@/components/AmplitudeProvider/amplitudeKeys';
import USPBanner from '@/components/UspBanner/UspBanner';
import Amplitude from '@/components/Amplitude/Amplitude';
import { useAmplitude } from '@/hooks/useAmplitude';
import { AmplitudeExperimentState } from '@/components/AmplitudeProvider/types';
import SearchModule from '@/modules/search';

const apiCall = new InvokeNativeAPICall();
const analytics = new InvokeNativeAnalytics();

const Home: NextPage<any> = () => {
  const platformAdapter = usePlatformAdapter();
  const router = useRouter();
  const userProfileValue = useAtomValue(userProfile);
  const [seeAllNews, setSeeAllNews] = useAtom(newsPanelStore);
  const bodyHeight = useRef<HTMLElement>(null);
  const { is } = useAmplitude();
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

  const showCampaignBanner =
    userProfileValue?.uuid !== undefined &&
    userProfileValue?.canRedeemOffer === true &&
    userProfileValue?.isAgeGated === true &&
    BRAND === 'blc-uk';

  const onCampaignClick = (clickedCampaignEvent: CampaignEvent) => {
    if (!userProfileValue) return;

    platformAdapter.logAnalyticsEvent(AmplitudeEvents.BLUE_REWARDS_CLICKED, {
      click_type: 'Homepage Banner',
    });

    router.push(
      `/odicci-iframe-campaign?iframeUrl=${encodeURIComponent(
        clickedCampaignEvent.content.iframeURL,
      )}`,
    );
  };

  return (
    <main ref={bodyHeight}>
      <div className="mb-9">
        {/* Conversion experiment */}
        <Amplitude
          keyName={Experiments.USP_BANNER_HOMEPAGE}
          value={AmplitudeExperimentState.Treatment}
        >
          <USPBanner></USPBanner>
        </Amplitude>

        <SearchModule />

        <PromoBanner />

        {showCampaignBanner && <CampaignBanner onClick={onCampaignClick} />}

        {is(Experiments.POPULAR_OFFERS, AmplitudeExperimentState.Treatment) && (
          <PopularBrandsSlider />
        )}
        <Offers />
        <NewsPreview />
      </div>
      <ListPanel visible={seeAllNews} onClose={seeAllClick}>
        {seeAllNews && <NewsList />}
      </ListPanel>
    </main>
  );
};

export default Home;
