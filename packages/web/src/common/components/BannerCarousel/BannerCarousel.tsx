import { CampaignCard, SwiperCarousel } from '@bluelightcard/shared-ui';
import React from 'react';
import { BannerCarouselPropers } from './types';

const BannerCarousel = ({ banners }: BannerCarouselPropers) => {
  return (
    <SwiperCarousel
      navigation
      elementsPerPageDesktop={2}
      elementsPerPageLaptop={2}
      elementsPerPageMobile={1}
      elementsPerPageTablet={2}
    >
      {banners.map((banner, index) => (
        <CampaignCard
          {...banner}
          key={`banner-carousel-image-${index}-${banner.name}`}
          className="h-[150px] desktop:h-[400px]"
        />
      ))}
    </SwiperCarousel>
  );
};

export default BannerCarousel;
