import OfferSheet from '@/components/OfferSheet/OfferSheet';
import { OfferMeta, OfferSheetContext, OfferSheetControlsContext } from './OfferSheetContext';
import React, { useCallback, useState } from 'react';
import { useLogOfferView } from '@/hooks/useLogOfferView';

type OfferSheetProviderProps = {
  children: React.ReactNode;
};

const OfferSheetProvider: React.FC<OfferSheetProviderProps> = ({ children }) => {
  const logOfferView = useLogOfferView();
  const [offer, setOfferState] = useState<OfferMeta | null>(null);

  const setOffer = useCallback(
    (offer: OfferMeta | null) => {
      if (offer) {
        logOfferView('sheet', offer);
      }
      setOfferState(offer);
    },
    [logOfferView]
  );

  return (
    <OfferSheetControlsContext.Provider
      value={{
        setOffer,
      }}
    >
      <OfferSheetContext.Provider value={offer}>
        <OfferSheet offer={offer} close={() => setOffer(null)} />
        {children}
      </OfferSheetContext.Provider>
    </OfferSheetControlsContext.Provider>
  );
};

export default OfferSheetProvider;
