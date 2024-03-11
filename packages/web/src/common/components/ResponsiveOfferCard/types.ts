import { BgColorString } from '../Badge/types';

export type ResponsiveOfferCardProps = {
  id: string;
  type: 'Online' | 'In-store' | 'Gift card';
  name: string;
  image: string;
  companyId: string;
  companyName: string;
  variant?: 'vertical' | 'horizontal';
};

export type BgColorTagParser = {
  Online: BgColorString;
  'In-store': BgColorString;
  'Gift card': BgColorString;
};
