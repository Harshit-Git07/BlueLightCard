import { MenuOfferResponse } from '@blc-mono/discovery/application/models/MenuOfferResponse';

export type MenuResponse = {
  dealsOfTheWeek?: {
    offers: MenuOfferResponse[];
  };
  featured?: {
    offers: MenuOfferResponse[];
  };
  marketplace?: {
    title: string;
    description?: string;
    hidden?: boolean;
    offers: MenuOfferResponse[];
  }[];
  flexible?: {
    id: string;
    title: string;
    imageURL: string;
  }[];
};

export enum MenuType {
  DEALS_OF_THE_WEEK = 'dealsOfTheWeek',
  FEATURED = 'featured',
  MARKETPLACE = 'marketplace',
  FLEXIBLE = 'flexible',
}

export const AVAILABLE_MENU_TYPES = [
  MenuType.DEALS_OF_THE_WEEK,
  MenuType.FEATURED,
  MenuType.MARKETPLACE,
  MenuType.FLEXIBLE,
];
