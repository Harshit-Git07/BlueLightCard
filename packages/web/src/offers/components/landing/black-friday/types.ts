import { ThemeVariant } from '@/types/theme';

export interface BlackFridayBannerSectionProps {
  bannerSrc: string;
  title: string;
  subtitle: string;
  ctaText: string;
}

export interface BlackFridayHeroSectionProps {
  title: string;
  subtitle: string;
  paragraphs: string[];
  categoriesAndIds: { title: string; id: string }[];
  variant?: ThemeVariant.Primary | ThemeVariant.Secondary;
}

export interface BlackFridayOfferSectionProps {
  id: string;
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
