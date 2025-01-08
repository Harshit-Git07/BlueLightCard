import type { FC } from 'react';
import type { MenuCarouselsContainerProps } from '../types';
import { MenuOffersCarousel } from '../presenters';
import useMenusData from '../../../hooks/useMenusData';

export const Marketplace: FC<MenuCarouselsContainerProps> = ({ menus = [], onOfferClick }) => {
  const { data } = useMenusData(menus);

  return data.marketplace?.map((marketplaceCarousel) => (
    <MenuOffersCarousel
      key={`marketplace_carousel_${marketplaceCarousel.id}`}
      title={marketplaceCarousel.title}
      offers={marketplaceCarousel.offers}
      onOfferClick={onOfferClick}
    />
  ));
};
