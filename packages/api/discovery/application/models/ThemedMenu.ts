// Also known as Flexible menu

import { MenuEventOffer, MenuOffer } from './Menu';
import { MenuType } from './MenuResponse';

export type SubMenu = {
  id: string;
  title: string;
  description: string;
  imageURL: string;
  position: number;
};

// Expected ingestion type from the CMS events
export type IngestedThemedSubMenuOffer = SubMenu & {
  offers: {
    id: string;
    company: {
      id: string;
    };
    position: number;
    start?: string;
    end?: string;
    overrides: {
      title?: string;
      image?: string;
      description?: string;
    };
  }[];
};

// Expected ingestion type from the CMS events
export type IngestedThemedSubMenuEvent = SubMenu & {
  events: {
    id: string;
    venue: {
      id: string;
    };
    position: number;
    start?: string;
    end?: string;
    overrides: {
      title?: string;
      image?: string;
      description?: string;
    };
  }[];
};

// Expected internal type
export type ThemedSubMenuWithOffers = SubMenu & {
  offers: MenuOffer[];
  events: MenuEventOffer[];
};

type ThemedMenu = {
  id: string;
  menuType: MenuType.WAYS_TO_SAVE | MenuType.FLEXIBLE_OFFERS | MenuType.FLEXIBLE_EVENTS;
  name: string;
  startTime?: string;
  endTime?: string;
  updatedAt: string;
};

export type ThemedMenuOffer = ThemedMenu & {
  themedMenusOffers: IngestedThemedSubMenuOffer[];
};

export type ThemedMenuEvent = ThemedMenu & {
  themedMenusEvents: IngestedThemedSubMenuEvent[];
};
