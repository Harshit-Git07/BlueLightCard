import {
  BlackFridayBannerSectionProps,
  BlackFridayHeroSectionProps,
  BlackFridayOfferSectionProps,
} from '@/offers/components/landing/black-friday/types';

export type BlackFridayLandingPageConfigProps = {
  bannerSection: BlackFridayBannerSectionProps;
  heroSection: BlackFridayHeroSectionProps;
  offerSections: BlackFridayOfferSectionProps[];
};
