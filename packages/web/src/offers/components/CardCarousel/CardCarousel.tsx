import useIsVisible from '@/hooks/useIsVisible';
import Heading from '@/components/Heading/Heading';
import { useRef, useState, useEffect, useContext } from 'react';
import OfferCard from '@/offers/components/OfferCard/OfferCard';
import type { CardCarouselProps } from './types';
import OfferCardPlaceholder from '../OfferCard/OfferCardPlaceholder';
import { SwiperCarousel, OfferSheet } from '@bluelightcard/shared-ui';
import { Drawer } from '@bluelightcard/shared-ui/components/Drawer';
import AmplitudeContext from '../../../common/context/AmplitudeContext';

const CardCarousel = ({
  title,
  itemsToShow,
  offers,
  useSmallCards,
  opensOffersheet = true,
}: CardCarouselProps) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const isVisible = useIsVisible(carouselRef);
  const amplitude = useContext(AmplitudeContext);

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
          {title && (
            <Heading headingLevel="h2" className="pb-4">
              {title}
            </Heading>
          )}
          <SwiperCarousel
            elementsPerPageDesktop={itemsToShow}
            elementsPerPageLaptop={itemsToShow}
            elementsPerPageTablet={2}
            elementsPerPageMobile={1}
            navigation
            pagination
          >
            {offers.length > 0
              ? offers.map((offer, index) => {
                  const card = (
                    <OfferCard
                      alt={'Card'}
                      offerName={offer.offername ?? ''}
                      companyName={offer.companyname ?? ''}
                      imageSrc={offer.imageUrl}
                      offerLink={offer.href}
                      variant={useSmallCards ? 'small' : ''}
                      id={'_offer_card_' + index}
                      showFindOutMore
                      upperCaseTitle
                      offerId={offer.offerId}
                      companyId={offer.companyId}
                      hasLink={offer.hasLink}
                      key={'Card-' + index}
                    />
                  );
                  if (opensOffersheet) {
                    return (
                      <Drawer
                        key={'drawer-' + index}
                        drawer={OfferSheet}
                        companyId={offer.companyId!}
                        offerId={offer.offerId!}
                        companyName={offer.companyname!}
                        amplitude={amplitude}
                      >
                        {card}
                      </Drawer>
                    );
                  } else {
                    return card;
                  }
                })
              : [...Array(itemsToShow)].map((_, index) => <OfferCardPlaceholder key={index} />)}
          </SwiperCarousel>
        </>
      )}
    </div>
  );
};

export default CardCarousel;
