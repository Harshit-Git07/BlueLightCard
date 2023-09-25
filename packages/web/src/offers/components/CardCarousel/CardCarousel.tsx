import Carousel from '@/components/Carousel/Carousel';
import useIsVisible from '@/hooks/useIsVisible';
import Heading from '@/components/Heading/Heading';
import { useRef, useState, useEffect } from 'react';
import OfferCard from '@/offers/components/OfferCard/OfferCard';
import LoadingPlaceholder from '@/offers/components/LoadingSpinner/LoadingSpinner';
import { CardCarouselProps } from './types';

const CardCarousel = ({ title, itemsToShow, offers, useSmallCards }: CardCarouselProps) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const isVisible = useIsVisible(carouselRef);

  /** Set temporary placeholder height to only load carousel if space on screen */
  const [className, setClassName] = useState('h-[400px]');

  /** If element is visible on screen, remove placeholder height */
  useEffect(() => {
    if (isVisible) setClassName('');
  }, [isVisible]);

  return (
    <div className={className} ref={carouselRef}>
      {isVisible && (
        <>
          <Heading headingLevel="h2">{title}</Heading>
          {offers.length === 0 && <LoadingPlaceholder />}
          {offers.length > 0 && (
            <Carousel
              showControls
              autoPlay
              elementsPerPageDesktop={itemsToShow}
              elementsPerPageLaptop={itemsToShow}
              elementsPerPageMobile={1}
              elementsPerPageTablet={2}
            >
              {offers.map((offer, index) => (
                <OfferCard
                  key={index}
                  alt={'Card'}
                  offerName={offer.offername ?? ''}
                  companyName={offer.companyname ?? ''}
                  imageSrc={offer.imageUrl}
                  offerLink={offer.href}
                  variant={useSmallCards ? 'small' : ''}
                />
              ))}
            </Carousel>
          )}
        </>
      )}
    </div>
  );
};

export default CardCarousel;
