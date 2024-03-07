import { offerResponse } from '@/context/OfferSheet/OfferSheetContext';

export type OfferSheetProps = {
  offer: {
    offerId?: string;
    companyId?: string;
    companyName?: string;
  };
  onButtonClick?: () => void;
};

export type OfferDetails = {
  offer: {
    offerId?: string;
    companyId?: string;
    companyName?: string;
  };
  offerData: offerResponse;
  companyId?: string;
  onButtonClick: () => void;
  redemptionData?: RedemptionResponse;
};

export type OfferTopDetailsHeaderProps = {
  offerData: offerResponse;
  companyId?: string;
  showOfferDescription?: boolean;
  showShareFavorite?: boolean;
  showTerms?: boolean;
};

export type RedemptionDetails = {
  code: string;
  url: string;
};

export type OfferRedemptionProps = {
  offerData: offerResponse;
  companyId?: string;
  redemptionDetails: RedemptionDetails;
};

export type RedemptionResponse = {
  redemptionType?: string;
  redemptionDetails?: RedemptionDetails;
};
