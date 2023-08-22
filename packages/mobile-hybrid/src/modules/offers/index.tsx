import type { FC } from 'react';
import useOffers from '@/hooks/useOffers';
import Heading from '@/components/Heading/Heading';
import CardCarousel from '@/components/Carousel/CardCarousel';
import InvokeNativeNavigation from '@/invoke/navigation';
import InvokeNativeAnalytics from '@/invoke/analytics';
import { NewsPreview } from '../news';

const navigation = new InvokeNativeNavigation();
const analytics = new InvokeNativeAnalytics();

const Offers: FC = () => {
  const { flexible, groups } = useOffers();
  const onFlexOfferClick = (id: string) => {
    navigation.navigate(`/flexibleOffers.php?id=${id}`);
    analytics.logAnalyticsEvent({
      event: 'homepage_carousel_tile_clicked',
      parameters: {},
    });
  };
  const onCompanyOfferClick = (id: string) => {
    navigation.navigate(`/offerdetails.php?cid=${id}`);
    analytics.logAnalyticsEvent({
      event: 'homepage_carousel_tile_clicked',
      parameters: {},
    });
  };
  const onSlideChange = () => {
    analytics.logAnalyticsEvent({
      event: 'homepage_carousel_interacted',
      parameters: {},
    });
  };
  return (
    <>
      {flexible && (
        <div className="mb-4">
          <Heading title={flexible.title} />
          {flexible.subtitle.length && (
            <p className="px-4 mb-3 dark:text-neutral-white">{flexible.subtitle}</p>
          )}
          <CardCarousel
            slides={flexible.items.map((offer) => ({
              id: offer.id,
              imageSrc: offer.imagedetail,
            }))}
            onSlideItemClick={onFlexOfferClick}
            onSlideChanged={onSlideChange}
          />
        </div>
      )}
      <NewsPreview />
      <div className="my-2">
        {groups.map((group, index) => (
          <section key={`${group.title}_${index}`} className="mb-6">
            <Heading title={group.title} />
            <CardCarousel
              slides={group.items.map((offer) => ({
                id: offer.compid,
                title: offer.companyname,
                text: offer.offername,
                imageSrc: offer.image?.length ? offer.image : offer.s3logos,
              }))}
              onSlideItemClick={onCompanyOfferClick}
              onSlideChanged={onSlideChange}
            />
          </section>
        ))}
      </div>
    </>
  );
};

export default Offers;
