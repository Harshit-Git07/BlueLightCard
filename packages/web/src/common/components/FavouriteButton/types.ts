import { offerResponse } from '@/context/OfferSheet/OfferSheetContext';

export type FavouriteButtonProps = {
  offerData: offerResponse;
  companyId: string | undefined;
  hasText?: boolean;
};
