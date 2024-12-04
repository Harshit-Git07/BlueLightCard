import { FC } from 'react';
import { CampaignCard, SwiperCarousel, useCSSConditional } from '@bluelightcard/shared-ui';
import { BannerDataType, CombinedBannersType, TenancyBannerProps } from '../types';
import { trackTenancyClick } from '@/utils/amplitude';

export interface Props extends TenancyBannerProps {
  bannersData: CombinedBannersType;
}

/**
 * Presenter renders the banners data
 * @param {Props} props.bannersData - array of bannersData provided by its container
 * @param {Props} props.variant - defines the size of the component
 * @param {Props} props.title - title of the carousel to use for tracking events
 */
const TenancyBannerPresenter: FC<Props> = ({
  bannersData,
  variant = 'large',
  title = `${variant}_banner`,
}: Props) => {
  const banners = variant === 'small' ? bannersData.small : bannersData.large;

  const dynCss: string = useCSSConditional({
    'desktop:h-[400px]': variant === 'small',
    'desktop:h-[600px]': variant !== 'small',
  });

  const onBannerClick = (banner: BannerDataType) => () => {
    trackTenancyClick(title, banner.link);

    if (!banner.logClick) return;
    banner.logClick();
  };

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
          key={`tenancy-banner-${banner.link}-${variant}`}
          image={banner.imageSource}
          linkUrl={banner.link}
          name={banner.title ? banner.title : `banner-${index}`}
          className={`h-[150px] ${dynCss}`}
          onClick={onBannerClick(banner)}
        />
      ))}
    </SwiperCarousel>
  );
};

export default TenancyBannerPresenter;
