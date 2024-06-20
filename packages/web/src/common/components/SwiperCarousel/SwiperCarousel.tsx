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
  navigation,
  pagination,
}) => {
  return (
    <Swiper
      modules={[Navigation, Pagination, Autoplay]}
      loop
      autoplay={{ delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true }}
      spaceBetween={5}
      slidesPerView={elementsPerPageMobile}
      pagination={pagination ? { dynamicBullets: true, clickable: true } : undefined}
      navigation={navigation ?? undefined}
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
      className={pagination ? 'swiper-pagination-enabled' : ''}
    >
      {React.Children.map(children, (child, index) => (
        <SwiperSlide key={index}>{child}</SwiperSlide>
      ))}
    </Swiper>
  );
};

export default SwiperCarousel;
