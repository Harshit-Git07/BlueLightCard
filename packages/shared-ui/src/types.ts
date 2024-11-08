/**
 * Shared types go in this file
 */

import type { V2ApisGetOfferResponse } from '@blc-mono/offers-cms/api';

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

export type OfferTypeStrLiterals = V2ApisGetOfferResponse['type'];

/**
 * New offer type from CMS data sources to use going forward
 */
export type Offer = {
  offerID: number;
  companyID: string;
  companyName: string;
  offerType: OfferTypeStrLiterals;
  offerName: string;
  imageURL: string;
};

export type FlexibleOfferData = {
  id: string;
  title: string;
  description: string;
  imageURL: string;
  offers: Offer[];
};

export type AmplitudeEvent = (properties: AmplitudeArg) => void;

export enum BRAND {
  BLC_UK = 'blc-uk',
  BLC_AU = 'blc-au',
  DDS_UK = 'dds-uk',
}
