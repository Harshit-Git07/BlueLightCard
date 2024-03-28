import { FC, useEffect } from 'react';
import InvokeNativeNavigation from '@/invoke/navigation';
import PopularBrands from '@/components/PopularBrands/PopularBrands';
import InvokeNativeAnalytics from '@/invoke/analytics';
import { AmplitudeEvents } from '@/utils/amplitude/amplitudeEvents';
import InvokeNativeAPICall from '@/invoke/apiCall';
import { APIUrl } from '@/globals';
import useRecommendedBrands from '@/hooks/useRecommendedBrands';

const navigation = new InvokeNativeNavigation();
const analytics = new InvokeNativeAnalytics();
const invokeNativeAPICall = new InvokeNativeAPICall();

const RecommendedBrandsSlider: FC = () => {
  const recommendedBrands = useRecommendedBrands();

  useEffect(() => {
    invokeNativeAPICall.requestData(APIUrl.RecommendedCompanies);
  }, []);

  const onBrandItemClick = (compid: number) => {
    navigation.navigate(`/offerdetails.php?cid=${compid}`, 'home');
    analytics.logAnalyticsEvent({
      event: AmplitudeEvents.HOMEPAGE_CAROUSEL_CARD_CLICKED,
      parameters: {
        carousel_name: 'Recommended brands',
        brand_name: recommendedBrands.find((brand) => brand.id === compid)?.brandName,
      },
    });
  };

  const onCarouselInteracted = () => {
    analytics.logAnalyticsEvent({
      event: AmplitudeEvents.HOMEPAGE_CAROUSEL_INTERACTED,
      parameters: {
        carousel_name: 'Recommended brands',
      },
    });
  };

  return (
    <>
      {recommendedBrands.length > 0 && (
        <PopularBrands
          text="Explore brands picked for you with a swipe!"
          onBrandItemClick={onBrandItemClick}
          brands={recommendedBrands}
          onInteracted={onCarouselInteracted}
          title="Picked for you"
          rounded={false}
        />
      )}
    </>
  );
};

export default RecommendedBrandsSlider;
