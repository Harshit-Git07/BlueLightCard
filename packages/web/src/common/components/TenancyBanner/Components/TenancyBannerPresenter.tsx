import { FC } from 'react';
import { CampaignCard, SwiperCarousel } from '@bluelightcard/shared-ui';
import { BannerDataType, CombinedBannersType } from '../types';
import { faker } from '@faker-js/faker';
export interface Props {
  bannersData: CombinedBannersType;
  variant?: 'large' | 'small';
}
/**
 * Presenter renders the banners data
 * @param {Props} props.bannersData - array of bannersData provided by its container
 * @param {Props} props.variant - defines the size of the component
 */
const TenancyBannerPresenter: FC<Props> = ({ bannersData, variant = 'large' }: Props) => {
  return (
    <SwiperCarousel
      elementsPerPageLaptop={1}
      elementsPerPageDesktop={1}
      elementsPerPageTablet={1}
      elementsPerPageMobile={1}
      navigation
    >
      {variant === 'small'
        ? bannersData.small.map((banner: BannerDataType, index: number) => (
            <CampaignCard
              key={faker.string.uuid()}
              image={banner.imageSource}
              linkUrl={banner.link}
              name={`banner-${index}`}
              className="h-[200px]"
            />
          ))
        : bannersData.large.map((banner: BannerDataType, index: number) => (
            <CampaignCard
              key={banner.legacyCompanyId}
              image={banner.imageSource}
              linkUrl={banner.link}
              name={`banner-${index}`}
              className="h-[600px]"
            />
          ))}
    </SwiperCarousel>
  );
};

export default TenancyBannerPresenter;
