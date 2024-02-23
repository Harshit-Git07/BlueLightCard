export const REDEMPTIONS_EVENT_SOURCE = 'redemptions';
export enum RedemptionEventDetailType {
  // Successful redemptions
  REDEEMED_GENERIC = 'redeemed.generic',
  REDEEMED_PRE_APPLIED = 'redeemed.preApplied',
  REDEEMED_SHOW_CARD = 'redeemed.showCard',
  REDEEMED_VAULT_QR = 'redeemed.vaultQR',
  REDEEMED_VAULT = 'redeemed.vault',
}
