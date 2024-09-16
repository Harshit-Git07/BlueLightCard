import { useCallback, useContext, useMemo } from 'react';
import { OfferMeta, OfferSheetControlsContext } from './OfferSheetContext';

export function useOfferSheetControls() {
  const offer = useContext(OfferSheetControlsContext);

  const open = useCallback((newOffer: OfferMeta) => offer.setOffer(newOffer), [offer]);
  const close = useCallback(() => offer.setOffer(null), [offer]);

  return useMemo(() => ({ open, close }), [open, close]);
}
