export const redemptionTypes = ['Ballot'] as const;

export type Redemption = {
  drawDate: string;
  numberOfWinners: number;
  type: (typeof redemptionTypes)[number];
};
