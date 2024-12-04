import type { Offer } from '../../types';

export type OfferCardCarouselProps = {
  offers: Offer[];
  dealsOfTheWeek?: boolean;
  onOfferClick(offer: Offer): void;
};
