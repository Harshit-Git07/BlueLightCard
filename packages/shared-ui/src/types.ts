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

export enum CardStatus {
  AWAITING_ID_APPROVAL = 'AWAITING_ID_APPROVAL',
  ID_APPROVED = 'ID_APPROVED',
  ADDED_TO_BATCH = 'ADDED_TO_BATCH',
  USER_BATCHED = 'USER_BATCHED',
  PHYSICAL_CARD = 'PHYSICAL_CARD',
  AWAITING_ACTIVATION = 'AWAITING_ACTIVATION',
  CARD_LOST = 'CARD_LOST',
  CARD_EXPIRED_BY_ADMIN = 'CARD_EXPIRED_BY_ADMIN',
  CARD_EXPIRED = 'CARD_EXPIRED',
  DECLINED = 'DECLINED',
  PENDING_REFUND = 'PENDING_REFUND',
  REFUNDED = 'REFUNDED',
  AWAITING_ID = 'AWAITING_ID',
}

export enum RedemptionTypeEnum {
  GENERIC = 'generic',
  VAULT = 'vault',
  VAULT_QR = 'vaultQR',
  PRE_APPLIED = 'preApplied',
  SHOW_CARD = 'showCard',
}

export enum StatusCode {
  OK = 200,
}
