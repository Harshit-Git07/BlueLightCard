import { ComponentStatus, Offer } from '../../types';

export type OfferCardListProps = {
  status: ComponentStatus;
  onOfferClick: (offer: Offer) => void;
  offers: Offer[];
  columns?: number;
  variant?: 'vertical' | 'horizontal';
};
