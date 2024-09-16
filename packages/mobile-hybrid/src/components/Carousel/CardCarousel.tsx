import { FC, SetStateAction, useState } from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { CardCarouselProps } from '@/components/Carousel/types';
import Card from '../Card/Card';
import { cssUtil } from '@/utils/cssUtil';
import { Drawer, OfferSheet } from '@bluelightcard/shared-ui';

const CardCarousel: FC<CardCarouselProps> = ({ slides, onSlideItemClick, onSlideChanged }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleSlideChange = (index: SetStateAction<number>) => {
    setCurrentSlide(index);
    if (onSlideChanged) {
      onSlideChanged(index as number);
    }
  };

  return (
    <Carousel
      showStatus={false} // Hide the status indicator
      showThumbs={false} // Enable thumbs, defaults to true
      showIndicators={false} // Show the slide dots
      showArrows={false} // Show the navigation arrows
      centerMode={true} // Center the current item
      selectedItem={currentSlide} // Set the active slide index
      preventMovementUntilSwipeScrollTolerance={true}
      swipeScrollTolerance={30}
      onChange={handleSlideChange} // Event handler for slide change
    >
      {slides.map((slide, index) => {
        const css = cssUtil([
          'transform transition-transform px-4',
          currentSlide !== index ? 'scale-[.9]' : '',
        ]);
        return (
          <div key={index} className={css}>
            <Drawer
              drawer={OfferSheet}
              companyId={slide.id}
              companyName={slide.title || ''}
              offerId={slide.offerId || 0}
            >
              <Card
                text={slide.title}
                title={slide.text}
                imageSrc={slide.imageSrc}
                onClick={() => onSlideItemClick && onSlideItemClick(slide.id)}
              />
            </Drawer>
          </div>
        );
      })}
    </Carousel>
  );
};

export default CardCarousel;
