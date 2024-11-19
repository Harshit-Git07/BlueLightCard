import { BRAND } from '@/global-vars';
import { BRANDS } from '@/types/brands.enum';

export const appleStoreUrl = ((): string => {
  switch (BRAND) {
    case BRANDS.BLC_UK:
      return 'https://itunes.apple.com/gb/app/blue-light-card/id689970073?mt=8';
    case BRANDS.BLC_AU:
      return 'https://apps.apple.com/au/app/blue-light-card/id1637398997';
    case BRANDS.DDS_UK:
      return 'https://apps.apple.com/gb/app/defence-discount-service/id652448774';
  }
})();
