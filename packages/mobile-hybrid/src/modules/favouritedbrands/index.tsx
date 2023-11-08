import { FC } from 'react';
import InvokeNativeNavigation from '@/invoke/navigation';
import PopularBrands from '@/components/PopularBrands/PopularBrands';
import InvokeNativeAnalytics from '@/invoke/analytics';
import useFavouritedBrands from '@/hooks/useFavouritedBrands';

const navigation = new InvokeNativeNavigation();
const analytics = new InvokeNativeAnalytics();

const FavouritedBrandsSlider: FC = () => {
  const brands = useFavouritedBrands();
  const onBrandItemClick = (compid: number) => {
    navigation.navigate(`/offerdetails.php?cid=${compid}`);
    analytics.logAnalyticsEvent({
      event: 'homepage_carousel_card_clicked',
      parameters: {
        carousel_name: 'favourited_brands',
        brand_name: brands.find((brand) => brand.id === compid)?.brandName,
      },
    });
  };
  return (
    <PopularBrands
      rounded={false}
      onBrandItemClick={onBrandItemClick}
      brands={brands}
      title="Favourited brands"
    />
  );
};

export default FavouritedBrandsSlider;
