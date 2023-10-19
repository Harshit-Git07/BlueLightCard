export type BannerType = {
  image: string;
  href: string;
};

export type DealsOfTheWeekType = {
  offername: string;
  companyname: string;
  image?: string;
  logos?: string;
  href: string;
  compid: number;
  id: number;
};

export type MarketPlaceItemType = {
  item: {
    offername: string;
    companyname: string;
    image: string;
    compid: string;
    id: string;
    logos: string;
  };
};

export type MarketPlaceMenuType = {
  name: string;
  hidden: boolean;
  items: MarketPlaceItemType[];
};

export type FlexibleMenuType = {
  title: string;
  imagehome: string;
  hide: boolean;
};

export type FeaturedOffersType = {
  offername: string;
  companyname: string;
  image?: string;
  logos?: string;
  compid: string;
  id: string;
};

export type CompanyType = {
  id: string;
  name: string;
};

export type CategoryType = {
  id: string;
  name: string;
};
