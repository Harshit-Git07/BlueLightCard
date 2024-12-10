/**
 * Shared types go in this file
 */

import type { V2ApisGetOfferResponse } from '@blc-mono/offers-cms/api';
import { ChangeEventHandler } from 'react';

export enum PlatformVariant {
  MobileHybrid = 'mobile-hybrid',
  Web = 'web',
}

export enum SizeVariant {
  Small = 'small',
  Medium = 'medium',
  Large = 'large',
}

export enum Channels {
  API_RESPONSE = 'nativeAPIResponse',
  EXPERIMENTS = 'nativeExperiments',
  APP_LIFECYCLE = 'nativeAppLifecycle',
}

export interface SharedProps {
  platform?: PlatformVariant;
}

export enum ThemeVariant {
  Primary = 'primary',
  Secondary = 'secondary',
  Tertiary = 'tertiary',
  PrimaryDanger = 'primary-danger',
  TertiaryDanger = 'tertiary-danger',
}

export type ThemeColorTokens = Record<
  string,
  {
    base: Record<string, string>;
    invert?: Record<string, string>;
  }
>;

export type AmplitudeLogParams = {
  [key: string]: string | number | boolean | undefined;
};

export type AmplitudeArg = {
  event: string;
  params: AmplitudeLogParams;
};

export type ComponentStatus = 'loading' | 'error' | 'success';

export type PaginatedData = {
  meta: {
    totalPages: number;
  };
};

export type OfferTypeStrLiterals = V2ApisGetOfferResponse['type'];

/**
 * New offer type from CMS data sources to use going forward
 */
export type Offer = {
  offerID: number | string;
  companyID: string;
  companyName: string;
  offerType: OfferTypeStrLiterals;
  offerName: string;
  imageURL: string;
  legacyCompanyID?: number;
  legacyOfferID?: number;
  offerDescription?: string;
};

export type OfferEventHandler = (offer: Offer) => void;

export type FlexibleOfferData = {
  id: string;
  title: string;
  description: string;
  imageURL: string;
  offers: Offer[];
};

export type CategoryData = {
  id: string;
  name: string;
  data: Offer[];
};

export type PaginatedCategoryData = CategoryData & PaginatedData;

export type CustomerCardData = {
  cardNumber?: string;
  cardCreated?: string;
  cardExpiry?: string;
  cardStatus?: string;
  cardPaymentStatus?: string;
};

export type CustomerApplicationData = {
  startDate: string;
  eligibilityStatus: string;
  applicationReason: string;
  verificationMethod: string;
  address1: string;
  address2: string;
  city: string;
  postcode: string;
  country: string;
  promoCode: string;
  trustedDomainEmail: string;
  trustedDomainVerified: boolean;
  rejectionReason: string;
};

export type CustomerProfileData = {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  phoneNumber: string;
  emailAddres: string;
  county: string;
  employmentType: string;
  organisationId: string;
  employerId: string;
  employerName: string;
  jobtitle: string;
  reference: string;
  card: CustomerCardData;
  applications: CustomerApplicationData[];
};

export type DealsOfTheWeekData = {
  id: string;
  offers: Offer[];
};

export type FeaturedOffersData = {
  id: string;
  offers: Offer[];
};

export type MarketplaceData = {
  id: string;
  title: string;
  offers: Offer[];
};

export type FlexibleMenuData = {
  id: string;
  title: string;
  imageURL: string;
};

export type FlexibleMenusData = {
  id: string;
  title: string;
  menus: FlexibleMenuData[];
};

export type MenusData = {
  dealsOfTheWeek?: DealsOfTheWeekData;
  featured?: FeaturedOffersData;
  marketplace?: MarketplaceData[];
  flexible?: FlexibleMenusData[];
};

export type AmplitudeEvent = (properties: AmplitudeArg) => void;

export enum BRAND {
  BLC_UK = 'blc-uk',
  BLC_AU = 'blc-au',
  DDS_UK = 'dds-uk',
}

export type Brand = BRAND.BLC_UK | BRAND.BLC_AU | BRAND.DDS_UK;

export type FieldProps = {
  id?: string;
  name?: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  value?: string;
  isValid?: boolean | undefined;
  label?: string;
  tooltip?: string;
  description?: string;
  placeholder?: string;
  validationMessage?: string;
  isRequired?: boolean;
  isDisabled?: boolean;
};
