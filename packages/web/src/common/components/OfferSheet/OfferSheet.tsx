import React, { useEffect, useRef } from 'react';
import DynamicSheet from '../DynamicSheet/DynamicSheet';
import { OfferSheetController } from './OfferDetailsController';
import { OfferMeta } from '@/context/OfferSheet/OfferSheetContext';

type OfferSheetProps = {
  offer: OfferMeta | null;
  close: () => void;
};

const OfferSheet: React.FC<OfferSheetProps> = ({ offer, close }) => {
  const lastOpenOfferRef = useRef<OfferMeta | null>(null);

  useEffect(() => {
    if (offer) {
      lastOpenOfferRef.current = offer;
    }
  }, [offer]);

  const offerToDisplay = offer || lastOpenOfferRef.current;

  return (
    <DynamicSheet
      isOpen={Boolean(offer)}
      onClose={close}
      showCloseButton
      containerClassName="flex flex-col justify-between w-full"
    >
      {offerToDisplay && <OfferSheetController offerMeta={offerToDisplay} />}
    </DynamicSheet>
  );
};

export default OfferSheet;
