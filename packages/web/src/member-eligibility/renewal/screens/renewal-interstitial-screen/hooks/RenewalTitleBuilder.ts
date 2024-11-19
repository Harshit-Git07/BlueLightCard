import { BRAND } from '@/global-vars';
import { BRANDS } from '@/types/brands.enum';
import { InterstitialScreenTitleProps } from '@/root/src/member-eligibility/shared/screens/shared/interstitial/interstitial-screen-title/InterstitialScreenTitle';

export function buildRenewalTitle(): InterstitialScreenTitleProps {
  if (BRAND === BRANDS.DDS_UK) {
    return {
      part1: 'Renew your ',
      part2: 'Defence Discount ',
      part3: 'Service Card!',
    };
  }

  return {
    part1: 'Renew your ',
    part2: 'Blue Light ',
    part3: 'Card!',
    lineBreakBeforeBrand: true,
  };
}
