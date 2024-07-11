import ResponsiveOfferCard from '../ResponsiveOfferCard';
import SwiperCarousel from '../SwiperCarousel';
import { OfferCardCarouselProps } from './types';
import { useMedia } from 'react-use';

const OfferCardCarousel = ({ offers, dealsOfTheWeek }: OfferCardCarouselProps) => {
  const isMobile = useMedia('(max-width: 500px)');
  return (
    <SwiperCarousel
      pagination={!isMobile}
      elementsPerPageDesktop={dealsOfTheWeek ? 2 : 3}
      elementsPerPageLaptop={dealsOfTheWeek ? 2 : 3}
      elementsPerPageMobile={1.1}
      elementsPerPageTablet={2}
    >
      {offers.map((offer, index) => (
        <ResponsiveOfferCard
          {...offer}
          key={`offer-card-carousel-image-${index}-${offer.companyName}`}
          id={offer.id}
          companyId={offer.companyId}
          companyName={offer.companyName}
          type={offer.type}
          name={offer.name}
          image={offer.image}
        />
      ))}
    </SwiperCarousel>
  );
};

export default OfferCardCarousel;
