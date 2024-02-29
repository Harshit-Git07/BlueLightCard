export type OfferSheetProps = {
  offer: {
    offerId?: string;
    companyId?: string;
    companyName?: string;
  };
  onButtonClick?: () => void;
};
