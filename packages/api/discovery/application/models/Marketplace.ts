export type Marketplace = {
  name: string;
  menus: MarketplaceMenu[];
  startTime: string;
  endTime: string;
  updatedAt: string;
};

export type MarketplaceMenu = {
  name: string;
  image: string;
  offers: number[];
  updatedAt: string;
};
