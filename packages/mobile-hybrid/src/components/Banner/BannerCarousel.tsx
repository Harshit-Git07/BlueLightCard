import { FC, SetStateAction, useState } from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { BannerCarouselProps } from '@/components/Banner/types';
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
      className="mb-4"
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
          <div className="max-h-[200px] h-[200px] flex items-center justify-center">
            <div className="h-full w-full relative">
              <Image alt={slide.text} src={slide.imageSrc} className="object-cover" />
            </div>
          </div>
          <p className="mb-2 py-3 font-museo max-h-[65px] dark:text-neutral-white line-clamp-2">
            {decodeEntities(slide.text)}
          </p>
        </div>
      ))}
    </Carousel>
  );
};

export default BannerCarousel;
