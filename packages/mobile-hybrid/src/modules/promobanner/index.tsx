import { FC, useMemo } from 'react';
import useOffers from '@/hooks/useOffers';
import BannerCarousel from '@/components/Banner/BannerCarousel';
import InvokeNativeNavigation from '@/invoke/navigation';
import InvokeNativeAnalytics from '@/invoke/analytics';
import { OfferPromosModel } from '@/models/offer';

const navigation = new InvokeNativeNavigation();
const analytics = new InvokeNativeAnalytics();

const PromoBanner: FC = () => {
  const onSlideItemClick = ({ compid, companyname, offername }: OfferPromosModel) => {
    navigation.navigate(`/offerdetails.php?cid=${compid}`);
    analytics.logAnalyticsEvent({
      event: 'homepage_carousel_card_clicked',
      parameters: {
        carousel_name: 'Billboard',
        brand_name: companyname,
        brand_offer: offername,
      },
    });
  };

  const onSlideChange = () => {
    analytics.logAnalyticsEvent({
      event: 'homepage_carousel_interacted',
      parameters: {
        carousel_name: 'Billboard',
      },
    });
  };
  const { deals: promos } = useOffers();
  const deals = useMemo(
    () =>
      promos.reduce((acc, deal) => {
        deal.items.forEach((item) => {
          acc.push(item);
        });
        return acc;
      }, [] as OfferPromosModel[]),
    [promos],
  );

  return (
    <>
      {!!deals.length && (
        <BannerCarousel
          slides={deals.map((deal) => ({
            id: deal.id,
            text: deal.offername,
            imageSrc: deal.image?.length ? deal.image : deal.s3logos,
          }))}
          onSlideItemClick={(id) =>
            onSlideItemClick(deals.find((deal) => deal.id === id) as OfferPromosModel)
          }
        />
      )}
    </>
  );
};

export default PromoBanner;
