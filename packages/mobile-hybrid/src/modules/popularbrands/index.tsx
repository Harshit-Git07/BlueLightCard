import { FC } from 'react';
import InvokeNativeNavigation from '@/invoke/navigation';
import brands from './brands';
import PopularBrands from '@/components/PopularBrands/PopularBrands';
import InvokeNativeAnalytics from '@/invoke/analytics';
import { AmplitudeEvents } from '@/utils/amplitude/amplitudeEvents';
import { Experiments } from '@/components/AmplitudeProvider/amplitudeKeys';
import { useAmplitude } from '@/hooks/useAmplitude';
import {
  AmplitudeExperimentState,
  AmplitudeFeatureFlagState,
} from '@/components/AmplitudeProvider/types';

const navigation = new InvokeNativeNavigation();
const analytics = new InvokeNativeAnalytics();

const PopularBrandsSlider: FC = () => {
  const { is } = useAmplitude();

  /**
   * @featureFlag streamlined-homepage
   * @description Render the subtitle for popular brands if the feature flag is not on
   * */
  const controlSubtitle = is(Experiments.STREAMLINED_HOMEPAGE, AmplitudeFeatureFlagState.On)
    ? undefined
    : 'Explore popular brands with a swipe!';
  const onBrandItemClick = (compid: number) => {
    const companyPageExperiment = is(
      Experiments.NEW_COMPANY_PAGE,
      AmplitudeExperimentState.Treatment,
    );

    if (companyPageExperiment) navigation.navigate(`/company?cid=${compid}`);
    else navigation.navigate(`/offerdetails.php?cid=${compid}`);

    analytics.logAnalyticsEvent({
      event: AmplitudeEvents.HOMEPAGE_CAROUSEL_CARD_CLICKED,
      parameters: {
        carousel_name: 'Popular brands',
        brand_name: brands.find((brand) => brand.id === compid)?.brandName,
      },
    });
  };
  const onCarouselInteracted = () => {
    analytics.logAnalyticsEvent({
      event: AmplitudeEvents.HOMEPAGE_CAROUSEL_INTERACTED,
      parameters: {
        carousel_name: 'Popular brands',
      },
    });
  };
  return (
    <PopularBrands
      text={controlSubtitle}
      onBrandItemClick={onBrandItemClick}
      brands={brands}
      onInteracted={onCarouselInteracted}
      title="Popular brands"
    />
  );
};

export default PopularBrandsSlider;
