import { FC } from 'react';
import InvokeNativeNavigation from '@/invoke/navigation';
import brands from './brands';
import PopularBrands from '@/components/PopularBrands/PopularBrands';
import InvokeNativeAnalytics from '@/invoke/analytics';
import { AmplitudeEvents } from '@/utils/amplitude/amplitudeEvents';

const navigation = new InvokeNativeNavigation();
const analytics = new InvokeNativeAnalytics();

const PopularBrandsSlider: FC = () => {
  const onBrandItemClick = (compid: number) => {
    navigation.navigate(`/company?cid=${compid}`);

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
      onBrandItemClick={onBrandItemClick}
      brands={brands}
      onInteracted={onCarouselInteracted}
      title="Popular brands"
    />
  );
};

export default PopularBrandsSlider;
