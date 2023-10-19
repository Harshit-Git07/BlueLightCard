import React from 'react';

import { Pagination, Navigation, Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import { CarouselProps } from './types';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const SwiperCarousel: React.FC<CarouselProps> = ({
  children,
  elementsPerPageDesktop = 5,
  elementsPerPageLaptop = 5,
  elementsPerPageTablet = 3,
  elementsPerPageMobile = 1,
  autoPlay = false,
  autoPlayIntervalMs = 2000,
  loop = false,
  hideArrows = false,
  hidePillButtons = false,
}) => {
  const autoPlayConfig = autoPlay
    ? { delay: autoPlayIntervalMs, disableOnInteraction: false }
    : false;

  const paginationConfig = !hidePillButtons ? { dynamicBullets: true, clickable: true } : false;

  const navigation = !hideArrows ? true : false;

  const className = paginationConfig ? `swiper-pagination-enabled` : '';

  return (
    <Swiper
      modules={[Navigation, Pagination, Autoplay]}
      loop={loop}
      autoplay={autoPlayConfig}
      spaceBetween={5}
      slidesPerView={elementsPerPageMobile}
      pagination={paginationConfig}
      navigation={navigation}
      grabCursor={true}
      breakpoints={{
        // when window width is >= 768px
        768: {
          slidesPerView: elementsPerPageTablet,
          spaceBetween: 10,
        },
        // when window width is >= 1024px
        1024: {
          slidesPerView: elementsPerPageLaptop,
          spaceBetween: 15,
        },
        // when window with is >= 1200
        1200: {
          slidesPerView: elementsPerPageDesktop,
          spaceBetween: 20,
        },
      }}
      className={className}
    >
      {React.Children.map(children, (child, index) => (
        <SwiperSlide key={index}>{child}</SwiperSlide>
      ))}
    </Swiper>
  );
};

export default SwiperCarousel;
