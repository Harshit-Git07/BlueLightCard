import { FC } from 'react';
import { CampaignCard, SwiperCarousel, useCSSConditional } from '@bluelightcard/shared-ui';
import { CombinedBannersType, TenancyBannerProps } from '../types';

export interface Props extends TenancyBannerProps {
  bannersData: CombinedBannersType;
}

/**
 * Presenter renders the banners data
 * @param {Props} props.bannersData - array of bannersData provided by its container
 * @param {Props} props.variant - defines the size of the component
 */
const TenancyBannerPresenter: FC<Props> = ({ bannersData, variant = 'large' }: Props) => {
  const banners = variant === 'small' ? bannersData.small : bannersData.large;

  const dynCss: string = useCSSConditional({
    'desktop:h-[400px]': variant === 'small',
    'desktop:h-[600px]': variant !== 'small',
  });

  return (
    <SwiperCarousel
      elementsPerPageLaptop={variant === 'small' ? 2 : 1}
      elementsPerPageDesktop={variant === 'small' ? 2 : 1}
      elementsPerPageTablet={variant === 'small' ? 2 : 1}
      elementsPerPageMobile={1}
      navigation
    >
      {banners.map((banner, index) => (
        <CampaignCard
          key={banner.link}
          image={banner.imageSource}
          linkUrl={banner.link}
          name={`banner-${index}`}
          className={`h-[150px] ${dynCss}`}
        />
      ))}
    </SwiperCarousel>
  );
};

export default TenancyBannerPresenter;
