import type { FC } from 'react';
import type { MenuCarouselsContainerProps } from '../types';
import { MenuOffersCarousel } from '../presenters';
import useMenusData from '../../../hooks/useMenusData';

export const Marketplace: FC<MenuCarouselsContainerProps> = ({
  user,
  menus = [],
  onOfferClick,
}) => {
  const { data } = useMenusData(user, menus);

  return data.marketplace?.map((marketplaceCarousel) => (
    <MenuOffersCarousel
      key={`marketplace_carousel_${marketplaceCarousel.id}`}
      title={marketplaceCarousel.title}
      offers={marketplaceCarousel.offers}
      onOfferClick={onOfferClick}
    />
  ));
};
