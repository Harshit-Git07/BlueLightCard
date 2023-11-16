import { FC, useContext } from 'react';
import InvokeNativeNavigation from '@/invoke/navigation';
import brands from './brands';
import PopularBrands from '@/components/PopularBrands/PopularBrands';
import InvokeNativeAnalytics from '@/invoke/analytics';
import { AppContext } from '@/store';

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
    navigation.navigate(`/offerdetails.php?cid=${compid}`);
    analytics.logAnalyticsEvent({
      event: 'homepage_carousel_card_clicked',
      parameters: {
        carousel_name: 'Popular brands',
        brand_name: brands.find((brand) => brand.id === compid)?.brandName,
      },
    });
  };
  const onCarouselInteracted = () => {
    analytics.logAnalyticsEvent({
      event: 'homepage_carousel_interacted',
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
