import { BRAND } from '@/global-vars';
import { BRANDS } from '@/types/brands.enum';

export const googleStoreUrl = ((): string => {
  switch (BRAND) {
    case BRANDS.BLC_UK:
      return 'https://play.google.com/store/apps/details?id=com.bluelightcard.user&amp;hl=en_GB';
    case BRANDS.BLC_AU:
      return 'https://play.google.com/store/apps/details?id=com.au.bluelightcard.user';
    case BRANDS.DDS_UK:
      return 'https://play.google.com/store/search?q=defence+discount+service&c=apps';
  }
})();
