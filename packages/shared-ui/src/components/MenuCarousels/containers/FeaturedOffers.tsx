import type { FC } from 'react';
import type { MenuCarouselsContainerProps } from '../types';
import { MenuOffersCarousel } from '../presenters';
import useMenusData from '../../../hooks/useMenusData';

export const FeaturedOffers: FC<MenuCarouselsContainerProps> = ({
  user,
  menus = [],
  onOfferClick,
}) => {
  const { data } = useMenusData(user, menus);

  return (
    <MenuOffersCarousel
      title="Featured Offers"
      offers={data.featured?.offers ?? []}
      onOfferClick={onOfferClick}
    />
  );
};
