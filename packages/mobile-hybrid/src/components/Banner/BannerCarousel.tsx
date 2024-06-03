import { FC, SetStateAction, useState } from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { BannerCarouselProps } from '@/components/Banner/types';
import { env } from '@bluelightcard/shared-ui';
import BannerCarouselV2 from './v2';
import Image from '@/components/Image/Image';
import decodeEntities from '@/utils/decodeEntities';

const BannerCarousel: FC<BannerCarouselProps> = ({ slides, onSlideItemClick, onSlideChanged }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);

  const handleSlideChange = (index: SetStateAction<number>) => {
    setCurrentSlide(index);
    if (onSlideChanged) {
      onSlideChanged(index as number);
    }
  };

  return (
    <Carousel
      showStatus={false}
      showThumbs={false}
      autoPlay={true}
      infiniteLoop={true}
      showIndicators={true}
      showArrows={false}
      selectedItem={currentSlide}
      className="mb-6"
      onChange={(index) => {
        if (isSwiping) {
          setIsSwiping(false);
          handleSlideChange(index);
        }
      }}
      onSwipeMove={() => {
        setIsSwiping(true);
        return true;
      }}
    >
      {slides.map((slide, index) => (
        <div
          key={index}
          role="button"
          onClick={() => onSlideItemClick && onSlideItemClick(slide.id)}
        >
          <div>
            <div className="relative h-auto pb-[50%]">
              <Image
                alt={decodeEntities(slide.text)}
                src={slide.imageSrc}
                className="absolute object-cover"
              />
            </div>
          </div>
          <p className="pt-2 px-2 font-museo dark:text-neutral-white line-clamp-2">
            {decodeEntities(slide.text)}
          </p>
        </div>
      ))}
    </Carousel>
  );
};

export default env.FLAG_NEW_TOKENS ? BannerCarouselV2 : BannerCarousel;
