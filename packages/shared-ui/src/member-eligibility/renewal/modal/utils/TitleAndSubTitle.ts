import { env } from '../../../../env';
import { BRAND } from '../../../../types';

const brandName = env.APP_BRAND === BRAND.DDS_UK ? 'Defence Discount' : 'Blue Light';

export const title = `Your ${brandName} Card has expired`;
export const subtitle = `Renew now to continue accessing exclusive discounts.`;
