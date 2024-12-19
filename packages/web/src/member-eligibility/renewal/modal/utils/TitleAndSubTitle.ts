import { BRAND } from '@bluelightcard/shared-ui/global-vars';
import { BRANDS } from '@/types/brands.enum';

const brandName = BRAND === BRANDS.DDS_UK ? 'Defence Discount' : 'Blue Light';

export const title = `Your ${brandName} Card has expired`;
export const subtitle = `Renew now to continue accessing exclusive discounts.`;
