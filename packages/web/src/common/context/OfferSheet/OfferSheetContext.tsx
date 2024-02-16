import { OfferSheetProps } from '@/components/OfferSheet/types';
import React from 'react';

export type offer = {
  offerId: string;
  companyId: string;
  offerName?: string;
  offerDescription?: string;
  termsAndConditions?: string;
  image?: string;
};

export type OfferSheetContextType = {
  open: boolean;
  setOpen: (open: boolean) => void;
  offer?: offer;
  setOffer: (arg1: offer) => void;
  offerLabels: string[];
  setLabels: (arg1: string[]) => void;
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
