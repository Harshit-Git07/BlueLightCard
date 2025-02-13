import { CardCarouselOffer } from '../../offers/components/CardCarousel/types';

export type BannerType = {
  imageSource: string;
  link: string;
  legacyCompanyId: string;
};

export type DealsOfTheWeekType = {
  offername: string;
  companyname: string;
  image?: string;
  logos?: string;
  href: string;
  compid: number | string;
  id: number | string;
};

export type MarketPlaceItemType = {
  item: {
    offername: string;
    companyname: string;
    image: string;
    compid: number | string;
    offerId: number | string;
    logos: string;
  };
};

export type MarketPlaceMenuType = {
  name: string;
  hidden: boolean;
  items: MarketPlaceItemType[];
};

export type FlexibleMenusDataTransformedForView = {
  id: string;
  title: string;
  menus: CardCarouselOffer[];
}[];

export type FlexibleMenuType = {
  id?: string;
  title: string;
  imagehome: string;
  hide: boolean;
};

export type FeaturedOffersType = {
  offername: string;
  companyname: string;
  image?: string;
  logos?: string;
  compid: number | string;
  id: number | string;
};
