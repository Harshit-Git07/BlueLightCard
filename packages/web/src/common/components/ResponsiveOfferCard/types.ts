import { OfferTypeStrLiterals } from '../../utils/offers/offerTypeParser';
import { BgColorString } from '../Badge/types';

export type ResponsiveOfferCardProps = {
  id: string;
  type: OfferTypeStrLiterals;
  name: string;
  image: string;
  companyId: string;
  companyName: string;
  variant?: 'vertical' | 'horizontal';
  quality?: number;
};

export type BgColorTagParser = {
  [key in OfferTypeStrLiterals]: BgColorString;
};
