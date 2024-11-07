import { OfferResponse } from '@blc-mono/discovery/application/models/OfferResponse';

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
