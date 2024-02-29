import OfferSheet from '@/components/OfferSheet/OfferSheet';
import OfferSheetContext, { offer } from './OfferSheetContext';
import React, { useState } from 'react';

type OfferSheetProviderProps = {
  children: React.ReactNode;
};

const OfferSheetProvider: React.FC<OfferSheetProviderProps> = ({ children }) => {
  const [offer, setOffer] = useState<offer | undefined>();
  const [open, setOpen] = useState<boolean>(false);
  const [labels, setLabels] = useState<string[]>([]);

  return (
    <OfferSheetContext.Provider
      value={{
        open: open,

        offer: offer,
        offerLabels: labels,

        setOpen: setOpen,
        setOffer: setOffer,
        setLabels: setLabels,
      }}
    >
      {offer && <OfferSheet offer={offer} />}
      {children}
    </OfferSheetContext.Provider>
  );
};

export default OfferSheetProvider;
