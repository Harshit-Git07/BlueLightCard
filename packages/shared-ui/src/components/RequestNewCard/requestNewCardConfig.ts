import { BRAND as envBrand } from '../../global-vars';
import { BRAND } from '../../types';

export const reprintPeriodInDays = 90;

export const drawerTitle = 'Request a new card';
export const problem = 'What’s the problem with your card?';
export const whereToSend = 'Where shall we send your physical card?';
export const withinReprintPeriod = `Your new physical card will be reprinted for free as you are still on the ${reprintPeriodInDays} days free reprint period.`;
export const outsideReprintPeriod = `Your new physical card will be reprinted for ${envBrand === String(BRAND.BLC_AU) ? '$' : '£'}4.99, valid for the next ${envBrand === String(BRAND.DDS_UK) ? 5 : 2} years.`;
