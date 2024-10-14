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

export type AmplitudeEvent = (properties: AmplitudeArg) => void;
