import { FC, useContext } from 'react';
import InvokeNativeNavigation from '@/invoke/navigation';
import brands from './brands';
import PopularBrands from '@/components/PopularBrands/PopularBrands';
import InvokeNativeAnalytics from '@/invoke/analytics';
import { AppContext } from '@/store';
import { AmplitudeEvents } from '@/utils/amplitude/amplitudeEvents';

const navigation = new InvokeNativeNavigation();
const analytics = new InvokeNativeAnalytics();

const PopularBrandsSlider: FC = () => {
  const { experiments: expr } = useContext(AppContext);

  /**
   * @featureFlag streamlined-homepage
   * @description Render the subtitle for popular brands if the feature flag is not on
   * */
  const controlSubtitle =
    expr['streamlined-homepage'] === 'on' ? undefined : 'Explore popular brands with a swipe!';
  const onBrandItemClick = (compid: number) => {
    navigation.navigate(`/offerdetails.php?cid=${compid}`, 'home');
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
