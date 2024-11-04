import { MenuType } from './MenuResponse';
import { Offer } from './Offer';

export type Menu = {
  id: string;
  menuType: MenuType;
  name: string;
  startTime: string;
  endTime: string;
  updatedAt: string;
};

// Expected ingestion type from the CMS events
export type MenuOffer = Menu & {
  offers: {
    id: string;
    company: {
      id: string;
    };
  }[];
};

// Expected internal type
export type MenuWithOffers = Menu & {
  offers: Offer[];
};
