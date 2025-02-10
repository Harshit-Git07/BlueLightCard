import { MenuType } from './MenuResponse';
import { EventOffer, Offer } from './Offer';
import { SubMenu } from './ThemedMenu';

export type Menu = {
  id: string;
  menuType: MenuType;
  name: string;
  startTime?: string;
  endTime?: string;
  updatedAt: string;
  // Position not required with featured & dotw, only marketplace
  position?: number;
};

export type IngestedMenuOffer = Menu & {
  offers: {
    id: string;
    company: {
      id: string;
    };
    start?: string;
    end?: string;
    position: number;
  }[];
};

export type MenuOffer = Offer & {
  start?: string;
  end?: string;
  position: number;
};

export type MenuEventOffer = EventOffer & {
  start?: string;
  end?: string;
  position: number;
};

export type MenuWithSubMenus = Menu & {
  subMenus: SubMenu[];
};

export type MenuWithSubMenuAndOffers = Menu & {
  subMenus: SubMenu[];
  offers: MenuOffer[];
};

// Expected internal type
export type MenuWithOffers = Menu & {
  offers: MenuOffer[];
};
