import { OfferSheetProps } from '@/components/OfferSheet/types';
import React from 'react';

export type offer = {
  offerId?: string;
  companyId?: string;
  offerName?: string;
  offerDescription?: string;
  termsAndConditions?: string;
  image?: string;
  expiry?: string;
  type?: string;
  companyName?: string;
};

export type offerResponse = {
  id?: string;
  companyId?: string;
  name?: string;
  description?: string;
  terms?: string;
  companyLogo?: string;
  expiry?: string;
  type?: string;
};

export type OfferSheetContextType = {
  open: boolean;
  setOpen: (open: boolean) => void;
  offer?: offer;
  setOffer: (offerDetails: offer) => void;
  offerLabels: string[];
  setLabels: (labelDetails: string[]) => void;
};

const OfferSheetContext = React.createContext<OfferSheetContextType>({
  open: false,
  setOpen: () => {},
  setOffer: () => {},
  setLabels: () => {},
  offer: {
    offerId: '',
    companyId: '',
  },
  offerLabels: [],
});

export default OfferSheetContext;
