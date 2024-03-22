import _noop from 'lodash/noop';
import React from 'react';

export type OfferMeta = {
  offerId: string;
  companyId: string;
  companyName: string;
};

export type OfferSheetControlsContext = {
  setOffer: (offer: OfferMeta | null) => void;
};
export const OfferSheetControlsContext = React.createContext<OfferSheetControlsContext>({
  setOffer: _noop,
});

export const OfferSheetContext = React.createContext<OfferMeta | null>(null);
