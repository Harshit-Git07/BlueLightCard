/**
 * Shared types go in this file
 */

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

export type OfferTypeStrLiterals = 'Online' | 'In-store' | 'Giftcards';

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

export type AmplitudeEvent = (properties: AmplitudeArg) => void;
