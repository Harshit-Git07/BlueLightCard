import { FC } from 'react';
import InvokeNativeNavigation from '@/invoke/navigation';
import PopularBrands from '@/components/PopularBrands/PopularBrands';
import InvokeNativeAnalytics from '@/invoke/analytics';
import useFavouritedBrands from '@/hooks/useFavouritedBrands';
import { AmplitudeEvents } from '@/utils/amplitude/amplitudeEvents';
const navigation = new InvokeNativeNavigation();
const analytics = new InvokeNativeAnalytics();

const FavouritedBrandsSlider: FC = () => {
  const controlSubtitle = 'Star brands you love or plan to revisit so they show up here';

  const brands = useFavouritedBrands();
  const onBrandItemClick = (compid: number) => {
    navigation.navigate(`/offerdetails.php?cid=${compid}`);
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
