import { FC } from 'react';
import { TenancyBannerProps } from '../types';
import TenancyBannerPresenter from './TenancyBannerPresenter';
import PromoBannerPlaceholder from '@/offers/components/PromoBanner/PromoBannerPlaceholder';
import useTenancyBanners from '../useTenancyBanners';

const TenancyBannerContainer: FC<TenancyBannerProps> = (props) => {
  const { loaded, banners } = useTenancyBanners();

  const variant = props.variant ?? 'large';
  const hasBanners = banners[variant]?.length > 0;

  return loaded && hasBanners ? (
    <TenancyBannerPresenter bannersData={banners} {...props} />
  ) : (
    <PromoBannerPlaceholder variant={variant} />
  );
};

export default TenancyBannerContainer;
