import { BRAND } from '@/global-vars';
import { BRANDS } from '@/types/brands.enum';
import { InterstitialScreenTitleProps } from '@/root/src/member-eligibility/shared/screens/interstitial-screen/components/interstitial-screen-title/InterstitialScreenTitle';

export function buildSignupTitle(): InterstitialScreenTitleProps {
  if (BRAND === BRANDS.DDS_UK) {
    return {
      start: 'Welcome to the',
      brand: 'Defence Discount',
      end: ' Service!',
    };
  }

  return {
    start: 'Welcome to',
    brand: 'Blue Light',
    end: 'Card!',
  };
}
