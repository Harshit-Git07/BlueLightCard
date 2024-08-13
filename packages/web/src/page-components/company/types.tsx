import { OfferTypeStrLiterals } from '@bluelightcard/shared-ui/index';

export type OfferData = {
  id: number;
  type: OfferTypeStrLiterals;
  name: string;
  image: string;
  companyId: string;
  companyName: string;
};

export type CompanyData = {
  id: string;
  name: string;
  description: string;
};

export type BannerDataType = {
  imageSource: string;
  link: string;
  __typename: string;
};

export type ResponseError = {
  message: string;
};
