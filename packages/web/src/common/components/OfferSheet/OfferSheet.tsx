import React, { useContext, useEffect, useRef } from 'react';
import DynamicSheet from '../DynamicSheet/DynamicSheet';
import { OfferSheetController } from './OfferDetailsController';
import { OfferMeta } from '@/context/OfferSheet/OfferSheetContext';
import { useMedia } from 'react-use';
import { useOfferDetails } from './hooks';
import AmplitudeContext from '@/context/AmplitudeContext';

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
  const amplitude = useContext(AmplitudeContext);
  const isOpen = Boolean(offer);

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
  //       platform={isMobile ? PlatformVariant.MobileHybrid : PlatformVariant.Web}
  //       isOpen={Boolean(offer)}
  //       onClose={close}
  //       height="80%"
  //       offerStatus={offerDetails.status}
  //       offerDetails={offerDetails.data}
  //       offerMeta={offerToDisplay as OfferMeta}
  //       cdnUrl={CDN_URL}
  //       amplitudeEvent={async ({ event, params }: AmplitudeArg) => {
  //         if (amplitude) {
  //           await amplitude.trackEventAsync(event, params);
  //         }
  //       }}
  //       BRAND={BRAND}
  //     />
  //   </div>
  // );

  // Manage scrollbar when offer sheet opens/closes
  useEffect(() => {
    if (isOpen) {
      // Disable scrollbar when offer sheet opens
      document.body.style.overflow = 'hidden';
    } else {
      // Re-enable scrollbar when offer sheet closes
      document.body.style.overflow = 'visible';
    }
  }, [isOpen]);

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
