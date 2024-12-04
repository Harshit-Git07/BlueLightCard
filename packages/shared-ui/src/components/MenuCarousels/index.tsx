import type { ReactElement } from 'react';
import type { MenuCarouselsComponent } from './types';
import { Children, Suspense, cloneElement } from 'react';
import { DealsOfTheWeek, FeaturedOffers, Marketplace } from './containers';
import { MenuCarouselSkeleton } from './presenters';

const MenuCarousels: MenuCarouselsComponent = ({ menus = '', children }) => {
  return Children.map(children, (child) => (
    <Suspense fallback={<MenuCarouselSkeleton />}>
      {cloneElement(child as ReactElement, { menus })}
    </Suspense>
  ));
};

MenuCarousels.DealsOfTheWeek = DealsOfTheWeek;
MenuCarousels.FeaturedOffers = FeaturedOffers;
MenuCarousels.Marketplace = Marketplace;

export default MenuCarousels;
