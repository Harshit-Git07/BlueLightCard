import { OfferMeta } from '@/context/OfferSheet/OfferSheetContext';
import { OfferData } from '@/types/api/offers';

export type OfferTopDetailsHeaderProps = {
  offerMeta: OfferMeta;
  offerData: OfferData;
  companyId?: string;
  showOfferDescription?: boolean;
  showShareFavorite?: boolean;
  showTerms?: boolean;
  showExclusions?: boolean;
};

export type RedemptionDetails = {
  code: string;
  url: string;
};

export type OfferRedemptionProps = {
  offerData: OfferData;
  companyId?: string;
  redemptionDetails: RedemptionDetails;
};

export type RedemptionResponse = {
  redemptionType?: string;
  redemptionDetails?: RedemptionDetails;
};
