import { FC, SetStateAction, useState } from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { CardCarouselProps } from '@/components/Carousel/types';
import Card from '../Card/Card';

const CardCarousel: FC<CardCarouselProps> = ({ slides }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleSlideChange = (index: SetStateAction<number>) => {
    setCurrentSlide(index);
  };

  return (
    <Carousel
      showStatus={false} // Hide the status indicator
      showThumbs={false} // Enable thumbs, defaults to true
      showIndicators={false} // Show the slide dots
      showArrows={false} // Show the navigation arrows
      centerMode={true} // Center the current item
      selectedItem={currentSlide} // Set the active slide index
      onChange={handleSlideChange} // Event handler for slide change
    >
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`transform transition-transform py-4 ${
            currentSlide === index
              ? 'scale-110'
              : currentSlide === index - 1 || (currentSlide === 0 && index === slides.length - 1)
              ? 'scale-90'
              : ''
          }`}
        >
          <Card text={slide.title} title={slide.text} imageSrc={slide.imageSrc} />
        </div>
      ))}
    </Carousel>
  );
};

export default CardCarousel;
