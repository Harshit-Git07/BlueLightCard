import { MenuOfferResponse } from '@blc-mono/discovery/application/models/MenuOfferResponse';

export type MenuResponse = {
  dealsOfTheWeek?: {
    offers: MenuOfferResponse[];
  };
  featured?: {
    offers: MenuOfferResponse[];
  };
  marketplace?: {
    menuName: string;
    hidden: boolean;
    offers: MenuOfferResponse[];
  }[];
  flexible?: {
    listID: string;
    title: string;
    imageURL: string;
  }[];
};

export enum MenuType {
  dealsOfTheWeek = 'dealsOfTheWeek',
  featured = 'featured',
  marketplace = 'marketplace',
  flexible = 'flexible',
}
