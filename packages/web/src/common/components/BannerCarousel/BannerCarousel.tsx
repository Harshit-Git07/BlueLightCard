import { CampaignCard } from '@bluelightcard/shared-ui';
import React from 'react';
import SwiperCarousel from '../SwiperCarousel/SwiperCarousel';
import { BannerCarouselPropers } from './types';

const BannerCarousel = ({ banners }: BannerCarouselPropers) => {
  return (
    <SwiperCarousel
      navigation
      elementsPerPageDesktop={1}
      elementsPerPageLaptop={1}
      elementsPerPageMobile={1}
      elementsPerPageTablet={1}
    >
      {banners.map((banner, index) => (
        <CampaignCard
          {...banner}
          key={`banner-carousel-image-${index}-${banner.name}`}
          className="h-[440px]"
        />
      ))}
    </SwiperCarousel>
  );
};

export default BannerCarousel;
