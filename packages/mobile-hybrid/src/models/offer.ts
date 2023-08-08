export interface OfferPromosModel {
  id: number;
  compid: number;
  offername: string;
  logos: string;
  companyname: string;
  image: string;
  s3Image: string;
  absoluteLogos: string;
  s3logos: string;
  absoluteImage: string;
}

export interface OfferSharedModel {
  title: string;
  random: boolean;
  items: OfferPromosModel[];
}

export interface OfferFlexibleModel {
  title: string;
  subtitle: string;
  random: boolean;
  items: {
    id: number;
    title: string;
    imagehome: string;
    imagedetail: string;
    navtitle: string;
    intro: string;
    footer: string;
    random: boolean;
    hide: boolean;
    items: any[];
  }[];
}

export interface OfferDataModel {
  deals: OfferSharedModel[];
  flexible: OfferFlexibleModel;
  groups: OfferSharedModel[];
}
