import type { FC } from 'react';
import useOffers from '@/hooks/useOffers';
import Heading from '@/components/Heading/Heading';
import CardCarousel from '@/components/Carousel/CardCarousel';
import InvokeNativeNavigation from '@/invoke/navigation';

const navigation = new InvokeNativeNavigation();

const Offers: FC = () => {
  const { flexible, groups } = useOffers();
  const onFlexOfferClick = (id: string) => {
    navigation.navigate(`/flexibleOffers.php?id=${id}`);
  };
  const onCompanyOfferClick = (id: string) => {
    navigation.navigate(`/offerdetails.php?cid=${id}`);
  };
  return (
    <div className="my-2">
      {flexible && (
        <div className="mb-4">
          <Heading title={flexible.title} />
          {flexible.subtitle.length && (
            <p className="px-4 mb-3 dark:text-primary-vividskyblue-700">{flexible.subtitle}</p>
          )}
          <CardCarousel
            slides={flexible.items.map((offer) => ({
              id: offer.id,
              imageSrc: offer.imagedetail,
            }))}
            onSlideItemClick={onFlexOfferClick}
          />
        </div>
      )}
      {groups.map((group, index) => (
        <section key={`${group.title}_${index}`} className="mb-6">
          <Heading title={group.title} />
          <CardCarousel
            slides={group.items.map((offer) => ({
              id: offer.compid,
              title: offer.companyname,
              text: offer.offername,
              imageSrc: offer.image,
            }))}
            onSlideItemClick={onCompanyOfferClick}
          />
        </section>
      ))}
    </div>
  );
};

export default Offers;
