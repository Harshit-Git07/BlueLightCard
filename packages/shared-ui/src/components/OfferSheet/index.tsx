import { SharedProps, PlatformVariant, AmplitudeEvent } from '../../types';
import { FC, useEffect } from 'react';
import DynamicSheet from '../DynamicSheet';
import { useSetAtom } from 'jotai';
import { offerSheetAtom } from './store';
import { OfferDetails, OfferMeta, OfferStatus, RedemptionType } from './types';
import OfferSheetControler from './components/OfferSheetControler';
import events from '../../utils/amplitude/events';

export type Props = SharedProps & {
  isOpen?: boolean;
  offerMeta: OfferMeta | undefined;
  offerDetails: OfferDetails | undefined;
  offerStatus: OfferStatus;
  onClose: () => void;
  height?: string;
  cdnUrl: string;
  isMobileHybrid?: boolean;
  amplitudeEvent: AmplitudeEvent;
  BRAND: string;
  redemptionType?: RedemptionType;
};

const OfferSheet: FC<Props> = ({
  platform = PlatformVariant.Mobile,
  isOpen = false,
  onClose,
  height,
  offerMeta,
  offerDetails,
  offerStatus,
  cdnUrl,
  isMobileHybrid,
  amplitudeEvent,
  BRAND,
  redemptionType,
}) => {
  const setOfferSheetData = useSetAtom(offerSheetAtom);

  useEffect(() => {
    if (!offerMeta && !offerDetails) return;
    setOfferSheetData((prev) => ({
      ...prev,
      isOpen,
      onClose,
      platform,
      cdnUrl,
      offerDetails: { ...offerDetails },
      offerMeta: { ...offerMeta },
      isMobileHybrid: isMobileHybrid || false,
      amplitudeEvent,
      BRAND,
    }));
  }, [offerMeta, offerDetails, isMobileHybrid]);

  useEffect(() => {
    if (isOpen && offerMeta && offerDetails && amplitudeEvent) {
      amplitudeEvent({
        event: events.OFFER_VIEWED,
        params: {
          company_id: String(offerMeta.companyId),
          company_name: offerMeta.companyName,
          offer_id: String(offerMeta.offerId),
          offer_name: offerDetails.name,
          source: 'sheet',
          origin: isMobileHybrid ? PlatformVariant.Mobile : PlatformVariant.Desktop,
          redemption_type: redemptionType,
        },
      });
    }
  }, [isOpen, offerMeta, offerDetails]);

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
    <>
      <DynamicSheet
        platform={platform}
        showCloseButton
        containerClassName="flex flex-col justify-between"
        height={height}
      >
        <OfferSheetControler offerStatus={offerStatus} />
      </DynamicSheet>
    </>
  );
};

export default OfferSheet;
