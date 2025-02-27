export enum MemberEvent {
  // System (self) triggered events
  SYSTEM_APPLICATION_PAYMENT = 'SYSTEM_APPLICATION_PAYMENT',
  SYSTEM_APPLICATION_APPROVED = 'SYSTEM_APPLICATION_APPROVED',

  // Braze updates
  BRAZE_PROFILE_CREATED = 'BRAZE_PROFILE_CREATED',
  BRAZE_PROFILE_UPDATED = 'BRAZE_PROFILE_UPDATED',
  BRAZE_APPLICATION_CREATED = 'BRAZE_APPLICATION_CREATED',
  BRAZE_APPLICATION_UPDATED = 'BRAZE_APPLICATION_UPDATED',
  BRAZE_APPLICATION_DELETED = 'BRAZE_APPLICATION_DELETED',
  BRAZE_CARD_CREATED = 'BRAZE_CARD_CREATED',
  BRAZE_CARD_UPDATED = 'BRAZE_CARD_UPDATED',
  BRAZE_USER_ANON = 'BRAZE_USER_ANON',
  BRAZE_USER_GDPR = 'BRAZE_USER_GDPR',

  // Data warehouse streams
  DWH_PROFILE_CREATED = 'DWH_PROFILE_CREATED',
  DWH_PROFILE_UPDATED = 'DWH_PROFILE_UPDATED',
  DWH_APPLICATION_CREATED = 'DWH_APPLICATION_CREATED',
  DWH_APPLICATION_UPDATED = 'DWH_APPLICATION_UPDATED',
  DWH_CARD_CREATED = 'DWH_CARD_CREATED',
  DWH_CARD_UPDATED = 'DWH_CARD_UPDATED',
  DWH_USER_ANON = 'DWH_USER_ANON',
  DWH_USER_GDPR = 'DWH_USER_GDPR',

  // Outbound email
  EMAIL_SIGNUP = 'EMAIL_SIGNUP',
  EMAIL_GENIE_CHECKS = 'EMAIL_GENIE_CHECKS',
  EMAIL_TRUSTED_DOMAIN = 'EMAIL_TRUSTED_DOMAIN',
  EMAIL_PROMO_PAYMENT = 'EMAIL_PROMO_PAYMENT',
  EMAIL_PAYMENT_MADE = 'EMAIL_PAYMENT_MADE',
  EMAIL_MEMBERSHIP_LIVE = 'EMAIL_MEMBERSHIP_LIVE',
  EMAIL_CARD_CREATED = 'EMAIL_CARD_CREATED',
  EMAIL_CARD_POSTED = 'EMAIL_CARD_POSTED',
  EMAIL_RENEWAL = 'EMAIL_RENEWAL',
  EMAIL_CHANGE_REQUEST = 'EMAIL_CHANGE_REQUEST',

  // Legacy events (identity table forward updates, also collected by verify)
  LEGACY_USER_PROFILE_CREATED = 'LEGACY_USER_PROFILE_CREATED',
  LEGACY_USER_PROFILE_UPDATED = 'LEGACY_USER_PROFILE_UPDATED',
  LEGACY_USER_APPLICATION_CREATED = 'LEGACY_USER_APPLICATION_CREATED',
  LEGACY_USER_APPLICATION_UPDATED = 'LEGACY_USER_APPLICATION_UPDATED',
  LEGACY_USER_CARD_CREATED = 'LEGACY_USER_CARD_CREATED',
  LEGACY_USER_CARD_UPDATED = 'LEGACY_USER_CARD_UPDATED',
  LEGACY_USER_GDPR_REQUESTED = 'LEGACY_USER_GDPR_REQUESTED',
  LEGACY_USER_ANON_REQUESTED = 'LEGACY_USER_ANON_REQUESTED',
}
