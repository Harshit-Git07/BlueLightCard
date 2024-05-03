export const REDEMPTION_TYPES = ['generic', 'vault', 'vaultQR', 'showCard', 'preApplied'] as const;

// Events
export const REDEMPTIONS_EVENT_SOURCE = 'redemptions';
export enum RedemptionEventDetailType {
  // Member retrieved redemption details
  MEMBER_RETRIEVED_REDEMPTION_DETAILS = 'memberRetrievedRedemptionDetails',

  // Attempted redemptions
  MEMBER_REDEEM_INTENT = 'memberRedeemIntent',

  // Successful redemptions
  MEMBER_REDEMPTION = 'memberRedemption',
}
