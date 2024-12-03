import { BRAND } from '@/global-vars';
import { BRANDS } from '@/types/brands.enum';
import { InterstitialScreenTitleProps } from '@/root/src/member-eligibility/shared/screens/interstitial-screen/components/interstitial-screen-title/InterstitialScreenTitle';

export function buildRenewalTitle(): InterstitialScreenTitleProps {
  if (BRAND === BRANDS.DDS_UK) {
    return {
      start: 'Renew your',
      brand: 'Defence Discount',
      end: 'Service Card!',
    };
  }

  return {
    start: 'Renew your',
    brand: 'Blue Light',
    end: 'Card!',
  };
}
