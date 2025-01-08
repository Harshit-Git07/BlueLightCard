import type { FC, PropsWithChildren } from 'react';
import type { MenusData, Offer } from '../../types';

export interface MenuCarouselChildProps {
  menus?: Array<keyof MenusData>;
  onOfferClick?(offer: Offer): void;
}

export type MenuCarouselsContainerProps = MenuCarouselChildProps & {
  user: { dob: string; organisation: string };
};

export interface MenuCarouselsComponent extends FC<PropsWithChildren<MenuCarouselsContainerProps>> {
  DealsOfTheWeek: FC<MenuCarouselsContainerProps>;
  FeaturedOffers: FC<MenuCarouselsContainerProps>;
  Marketplace: FC<MenuCarouselsContainerProps>;
}

export interface MenuOffersCarouselPresenterProps
  extends Pick<MenuCarouselsContainerProps, 'onOfferClick'> {
  title: string;
  offers: Offer[];
}
