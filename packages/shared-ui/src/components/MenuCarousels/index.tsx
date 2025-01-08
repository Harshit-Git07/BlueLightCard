import type { ReactElement } from 'react';
import type { MenuCarouselsComponent } from './types';
import { Children, Suspense, cloneElement } from 'react';
import { DealsOfTheWeek, FeaturedOffers, Marketplace } from './containers';
import { MenuCarouselSkeleton } from './presenters';

const MenuCarousels: MenuCarouselsComponent = ({ user, menus = '', children }) => {
  return Children.map(children, (child) => (
    <Suspense fallback={<MenuCarouselSkeleton />}>
      {cloneElement(child as ReactElement, { menus, user })}
    </Suspense>
  ));
};

/* 
  Casting of these types happens here to allow the user to be typed and required in the child components.
  But passed through by passing the user to the MenuCarousels Wrapper Component
*/

MenuCarousels.DealsOfTheWeek = DealsOfTheWeek;
MenuCarousels.FeaturedOffers = FeaturedOffers;
MenuCarousels.Marketplace = Marketplace;

export default MenuCarousels;
