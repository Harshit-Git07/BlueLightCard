import { FC, SetStateAction, useState } from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { BannerCarouselProps } from '@/components/Banner/types';
import Image from '@/components/Image/Image';

const BannerCarousel: FC<BannerCarouselProps> = ({ slides }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleSlideChange = (index: SetStateAction<number>) => {
    setCurrentSlide(index);
  };

  return (
    <Carousel
      showStatus={false} // Hide the status indicator
      showThumbs={false}
      autoPlay={true}
      infiniteLoop={true}
      showIndicators={true} // Show the slide dots
      showArrows={false} // Show the navigation arrows
      selectedItem={currentSlide} // Set the active slide index
      onChange={handleSlideChange} // Event handler for slide change
    >
      {slides.map((slide, index) => (
        <div key={index}>
          <div className="max-h-[80vh] h-[200px] flex items-center justify-center">
            <div className="h-full w-full relative">
              <Image alt={slide.text} src={slide.imageSrc} className="object-cover" />
            </div>
          </div>
          <div className="">
            <p className="mb-4 px-2 text-lg dark:text-neutral-white">{slide.text}</p>
          </div>
        </div>
      ))}
    </Carousel>
  );
};

export default BannerCarousel;
