interface OfferBaseModel {
  id: number | string;
  compid: number | string;
  offername: string;
  logos: string;
  companyname: string;
  image: string;
  s3Image: string;
  absoluteLogos: string;
  s3logos: string;
  absoluteImage: string;
}

export type OfferPromosModel = OfferBaseModel;

export type OfferListItemModel = OfferBaseModel & {
  catid: number;
  typeid: number;
  available_offer_types: number[];
  available_offer_cats: number[];
};

export interface OfferSharedModel {
  title: string;
  random: boolean;
  items: OfferPromosModel[];
}

export interface OfferFlexibleItemModel {
  id: number | string;
  title: string;
  imagehome: string;
  imagedetail: string;
  navtitle: string;
  intro: string;
  footer: string;
  random: boolean;
  hide: boolean;
  items: any[];
}

export interface OfferFlexibleModel {
  title: string;
  subtitle: string;
  random: boolean;
  items: OfferFlexibleItemModel[];
}

export interface OfferDataModel {
  deal: OfferSharedModel[];
  flexible?: OfferFlexibleModel;
  flexibleEvents?: OfferFlexibleModel;
  allFlexible?: OfferFlexibleModel[];
  groups: OfferSharedModel[];
}
