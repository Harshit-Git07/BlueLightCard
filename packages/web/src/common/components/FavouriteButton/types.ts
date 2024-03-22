import { OfferMeta } from '@/context/OfferSheet/OfferSheetContext';
import { OfferData } from '@/types/api/offers';

export type FavouriteButtonProps = {
  offerMeta: OfferMeta;
  offerData: OfferData;
  hasText?: boolean;
};
