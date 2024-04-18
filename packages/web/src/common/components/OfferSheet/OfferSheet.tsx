import React, { useEffect, useRef } from 'react';
import DynamicSheet from '../DynamicSheet/DynamicSheet';
import { OfferSheetController } from './OfferDetailsController';
import { OfferMeta } from '@/context/OfferSheet/OfferSheetContext';
// import { OfferSheet as SharedOfferSheet } from '@bluelightcard/shared-ui';
import { useMedia } from 'react-use';
import { useOfferDetails } from './hooks';
// import { CDN_URL } from '@/root/global-vars';

type OfferSheetProps = {
  offer: OfferMeta | null;
  close: () => void;
};

export enum PlatformVariant {
  Mobile = 'mobile',
  Desktop = 'desktop',
}

const OfferSheet: React.FC<OfferSheetProps> = ({ offer, close }) => {
  const lastOpenOfferRef = useRef<OfferMeta | null>(null);
  const isMobile = useMedia('(max-width: 500px)', false);
  const offerToDisplay = offer || lastOpenOfferRef.current;
  const offerDetails = useOfferDetails(offerToDisplay as OfferMeta);
  // TODO should we add redemptionType call here?
  // const redemptionType = useRedemptionType(offerMeta);

  useEffect(() => {
    if (offer) {
      lastOpenOfferRef.current = offer;
    }
  }, [offer]);

  // TODO commenting out until the new experiment is set up
  // return (
  //   <div
  //     className={`${
  //       isMobile
  //         ? `w-full h-full transition-visibility duration-1000 ${
  //             Boolean(offer) ? 'visible' : 'invisible'
  //           }`
  //         : ''
  //     }`}
  //   >
  //     <SharedOfferSheet
  //       platform={isMobile ? PlatformVariant.Mobile : PlatformVariant.Desktop}
  //       isOpen={Boolean(offer)}
  //       onClose={close}
  //       height="80%"
  //       offerStatus={offerDetails.status}
  //       offerDetails={offerDetails.data}
  //       offerMeta={offerToDisplay as OfferMeta}
  //       cdnUrl={CDN_URL}
  //     />
  //   </div>
  // );

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
