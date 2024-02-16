import OfferSheet from '@/components/OfferSheet/OfferSheet';
import OfferSheetContext, { offer } from './OfferSheetContext';
import React from 'react';

type OfferSheetProviderProps = {
  children: React.ReactNode;
};

const OfferSheetProvider: React.FC<OfferSheetProviderProps> = ({ children }) => {
  const [offer, setOffer] = React.useState<offer | undefined>();
  const [open, setOpen] = React.useState<boolean>(false);
  const [labels, setLabels] = React.useState<string[]>([]);

  return (
    <OfferSheetContext.Provider
      value={{
        open: false,

        offer: offer,
        offerLabels: labels,

        setOpen: setOpen,
        setOffer: setOffer,
        setLabels: setLabels,
      }}
    >
      {offer && <OfferSheet open={open} setOpen={setOpen} offer={offer} labels={labels} />}
      {children}
    </OfferSheetContext.Provider>
  );
};

export default OfferSheetProvider;
