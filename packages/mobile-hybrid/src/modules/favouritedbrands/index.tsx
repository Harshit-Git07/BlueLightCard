import { FC, useContext } from 'react';
import InvokeNativeNavigation from '@/invoke/navigation';
import PopularBrands from '@/components/PopularBrands/PopularBrands';
import InvokeNativeAnalytics from '@/invoke/analytics';
import useFavouritedBrands from '@/hooks/useFavouritedBrands';
import { AppContext } from '@/store';
import { AmplitudeEvents } from '@/utils/amplitude/amplitudeEvents';
import { Experiments } from '@/components/AmplitudeProvider/amplitudeKeys';

const navigation = new InvokeNativeNavigation();
const analytics = new InvokeNativeAnalytics();

const FavouritedBrandsSlider: FC = () => {
  const { experiments: expr } = useContext(AppContext);

  /**
   * @featureFlag favourite-subtitle
   * @description Render the subtitle for the favourite brands carousel if the feature flag is on
   * */
  const controlSubtitle =
    expr[Experiments.FAVOURITE_SUBTITLE] === 'on'
      ? 'Star brands you love or plan to revisit so they show up here'
      : undefined;

  const brands = useFavouritedBrands();
  const onBrandItemClick = (compid: number) => {
    navigation.navigate(`/offerdetails.php?cid=${compid}`, 'home');
    analytics.logAnalyticsEvent({
      event: AmplitudeEvents.HOMEPAGE_CAROUSEL_CARD_CLICKED,
      parameters: {
        carousel_name: 'Favourite brands',
        brand_name: brands.find((brand) => brand.id === compid)?.brandName,
        company_id: compid,
      },
    });
  };
  const onCarouselInteracted = () => {
    analytics.logAnalyticsEvent({
      event: AmplitudeEvents.HOMEPAGE_CAROUSEL_INTERACTED,
      parameters: {
        carousel_name: 'Favourite brands',
      },
    });
  };
  return (
    <PopularBrands
      text={controlSubtitle}
      rounded={false}
      onBrandItemClick={onBrandItemClick}
      onInteracted={onCarouselInteracted}
      brands={brands}
      title="Your favourite brands"
    />
  );
};

export default FavouritedBrandsSlider;
