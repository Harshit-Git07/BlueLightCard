// Also known as Flexible menu

import { MenuType } from './MenuResponse';
import { EventOffer, Offer } from './Offer';

export type SubMenu = {
  id: string;
  title: string;
  description: string;
  imageURL: string;
};

// Expected ingestion type from the CMS events
export type ThemedSubMenuOffer = SubMenu & {
  offers: {
    id: string;
    company: {
      id: string;
    };
  }[];
};

// Expected ingestion type from the CMS events
export type ThemedSubMenuEvent = SubMenu & {
  events: {
    id: string;
    venue: {
      id: string;
    };
  }[];
};

// Expected internal type
export type ThemedSubMenuWithOffers = SubMenu & {
  offers: Offer[];
  events: EventOffer[];
};

type ThemedMenu = {
  id: string;
  menuType: MenuType.FLEXIBLE;
  name: string;
  startTime?: string;
  endTime?: string;
  updatedAt: string;
};

export type ThemedMenuOffer = ThemedMenu & {
  themedMenusOffers: ThemedSubMenuOffer[];
};

export type ThemedMenuEvent = ThemedMenu & {
  themedMenusEvents: ThemedSubMenuEvent[];
};
