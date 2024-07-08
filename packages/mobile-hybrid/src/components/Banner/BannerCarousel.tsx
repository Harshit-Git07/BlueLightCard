import { FC, SetStateAction, useState } from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { BannerCarouselProps } from './types';
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
      showIndicators={false}
      showArrows={false}
      selectedItem={currentSlide}
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
          <p className="pt-2 px-2 font-card-title-font text-card-title-font font-card-title-font-weight tracking-card-title-font leading-card-title-font text-card-title-colour dark:text-card-title-colour-dark line-clamp-2">
            {decodeEntities(slide.text)}
          </p>
        </div>
      ))}
    </Carousel>
  );
};

export default BannerCarousel;
