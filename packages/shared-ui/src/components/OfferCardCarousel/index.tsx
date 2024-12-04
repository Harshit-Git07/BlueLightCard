import OfferCardPlaceholder from '../OfferCardList/OfferCardPlaceholder';
import ResponsiveOfferCard from '../ResponsiveOfferCard';
import SwiperCarousel from '../SwiperCarousel';
import { OfferCardCarouselProps } from './types';
import { useMedia } from 'react-use';

const OfferCardCarousel = ({ offers, dealsOfTheWeek, onOfferClick }: OfferCardCarouselProps) => {
  const isMobile = useMedia('(max-width: 500px)');
  return (
    <SwiperCarousel
      navigation={!isMobile}
      pagination={!isMobile}
      elementsPerPageDesktop={dealsOfTheWeek ? 2 : 4}
      elementsPerPageLaptop={dealsOfTheWeek ? 2 : 3}
      elementsPerPageMobile={1.1}
      elementsPerPageTablet={2}
    >
      {offers.length > 0
        ? offers.map((offer, index) => (
            <ResponsiveOfferCard
              {...offer}
              key={`offer-card-carousel-image-${index}-${offer.companyName}`}
              id={offer.offerID.toString()}
              companyId={offer.companyID}
              companyName={offer.companyName}
              type={offer.offerType}
              name={offer.offerName}
              image={offer.imageURL}
              onClick={() => onOfferClick(offer)}
            />
          ))
        : Array.from(Array(4).keys()).map((key) => (
            <OfferCardPlaceholder
              key={`offer_card_carousel_placeholder_${key}`}
              variant="vertical"
              columns={1}
            />
          ))}
    </SwiperCarousel>
  );
};

export default OfferCardCarousel;
