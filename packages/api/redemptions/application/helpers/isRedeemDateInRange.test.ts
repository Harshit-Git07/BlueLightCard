import { isRedeemDateNotInRange } from './isRedeemDateInRange';

describe('isRedeemDateInRange', () => {
  it('should return false when redeem date is not in range', () => {
    const result = isRedeemDateNotInRange(new Date(2024, 1, 1, 21, 30), new Date(2024, 1, 1, 21, 15));
    expect(result).toBe(false);
  });

  it('should return false when redeem date is not range by 1 second', () => {
    const result = isRedeemDateNotInRange(new Date(2024, 1, 1, 21, 30), new Date(2024, 1, 1, 21, 29, 59, 59));
    expect(result).toBe(false);
  });

  it('should return false when redeem date is equal to draw date', () => {
    const result = isRedeemDateNotInRange(new Date(2024, 1, 1, 21, 30), new Date(2024, 1, 1, 21, 30));
    expect(result).toBe(false);
  });

  it('should return true when redeem date is in range', () => {
    const result = isRedeemDateNotInRange(new Date(2024, 1, 1, 21, 30), new Date(2024, 1, 1, 21, 30, 1, 1));
    expect(result).toBe(true);
  });
});
