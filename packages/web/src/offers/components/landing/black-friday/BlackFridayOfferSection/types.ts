import { ThemeVariant } from '@/types/theme';

export interface BlackFridayOfferSectionProps {
  title: string;
  subtitle: string;
  offers: BlackFridayOfferProps[];
  variant?: ThemeVariant.Primary | ThemeVariant.Secondary;
}

export interface BlackFridayOfferProps {
  imgSrc: string;
  title: string;
  link: string;
  variant?: ThemeVariant.Primary | ThemeVariant.Secondary;
}
