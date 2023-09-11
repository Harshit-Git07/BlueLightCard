import { FC, SetStateAction, useState } from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { BannerCarouselProps } from '@/components/Banner/types';
import Image from '@/components/Image/Image';
import decodeEntities from '@/utils/decodeEntities';

const BannerCarousel: FC<BannerCarouselProps> = ({ slides, onSlideItemClick, onSlideChanged }) => {
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
      showThumbs={false} // Toggle thumbnails
      autoPlay={true}
      infiniteLoop={true}
      showIndicators={false} // Show the slide dots
      showArrows={false} // Show the navigation arrows
      selectedItem={currentSlide} // Set the active slide index
      className="mb-4"
      onChange={handleSlideChange} // Event handler for slide change
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
          <p className="mb-2 py-3 dark:text-neutral-white">{decodeEntities(slide.text)}</p>
        </div>
      ))}
    </Carousel>
  );
};

export default BannerCarousel;
