import type { FC } from 'react';
import type { MenuCarouselsContainerProps } from '../types';
import { MenuOffersCarousel } from '../presenters';
import useMenusData from '../../../hooks/useMenusData';

export const DealsOfTheWeek: FC<MenuCarouselsContainerProps> = ({ menus = [], onOfferClick }) => {
  const { data } = useMenusData(menus);

  return (
    <MenuOffersCarousel
      title="Deals of the week"
      offers={data.dealsOfTheWeek?.offers ?? []}
      onOfferClick={onOfferClick}
    />
  );
};
