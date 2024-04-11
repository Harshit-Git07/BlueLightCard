/**
 * Shared types go in this file
 */

export enum PlatformVariant {
  Mobile = 'mobile',
  Desktop = 'desktop',
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
