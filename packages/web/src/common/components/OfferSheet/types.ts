export type OfferSheetProps = {
  open: boolean;
  setOpen?: (open: boolean) => void;
  offer: {
    offerId?: string;
    companyId: string;
    offerName?: string;
    offerDescription?: string;
    image?: string;
    termsAndConditions?: string;
  };
  labels?: string[];
  onButtonClick?: () => void;
};
