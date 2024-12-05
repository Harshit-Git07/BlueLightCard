import { computeValue } from '@/root/src/member-eligibility/shared/utils/ComputeValue';
import { BRAND } from '@/global-vars';
import { BRANDS } from '@/types/brands.enum';

const brandName = computeValue(() => {
  return BRAND === BRANDS.DDS_UK ? 'Defence Discount' : 'Blue Light';
});

export const title = `Your ${brandName} Card has expired`;

export const subtitle = `Renew now to continue accessing exclusive discounts.`;
