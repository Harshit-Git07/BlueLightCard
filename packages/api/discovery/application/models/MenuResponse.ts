import { OfferResponse } from '@blc-mono/discovery/application/models/OfferResponse';

type FlexiMenuResponse = {
  id: string;
  title: string;
  menus: { id: string; title: string; imageURL: string }[];
};

export type MenuResponse = {
  dealsOfTheWeek?: {
    id: string;
    offers: OfferResponse[];
  };
  featured?: {
    id: string;
    offers: OfferResponse[];
  };
  marketplace?: {
    id: string;
    title: string;
    description?: string;
    hidden?: boolean;
    offers: OfferResponse[];
  }[];
  flexible?: {
    offers?: FlexiMenuResponse[];
    events?: FlexiMenuResponse[];
  };
};

export enum MenuType {
  DEALS_OF_THE_WEEK = 'dealsOfTheWeek',
  FEATURED = 'featured',
  MARKETPLACE = 'marketplace',
  FLEXIBLE = 'flexible',
  WAYS_TO_SAVE = 'waysToSave',
  FLEXIBLE_OFFERS = 'flexibleOffers',
  FLEXIBLE_EVENTS = 'flexibleEvents',
}

export const AVAILABLE_MENU_TYPES = [
  MenuType.DEALS_OF_THE_WEEK,
  MenuType.FEATURED,
  MenuType.MARKETPLACE,
  MenuType.FLEXIBLE,
];
