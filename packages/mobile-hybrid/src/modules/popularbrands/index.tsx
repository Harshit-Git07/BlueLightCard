import { FC } from 'react';
import InvokeNativeNavigation from '@/invoke/navigation';
import brands from './brands';
import PopularBrands from '@/components/PopularBrands/PopularBrands';
import InvokeNativeAnalytics from '@/invoke/analytics';

const navigation = new InvokeNativeNavigation();
const analytics = new InvokeNativeAnalytics();

const PopularBrandsSlider: FC = () => {
  const onBrandItemClick = (compid: number) => {
    navigation.navigate(`/offerdetails.php?cid=${compid}`);
    analytics.logAnalyticsEvent({
      event: 'homepage_carousel_card_clicked',
      parameters: {
        carousel_name: 'popular_brands',
        brand_name: brands.find((brand) => brand.id === compid)?.altText,
      },
    });
  };
  return (
    <PopularBrands
      text="Explore popular brands with a swipe!"
      onBrandItemClick={onBrandItemClick}
      brands={brands}
    />
  );
};

export default PopularBrandsSlider;
