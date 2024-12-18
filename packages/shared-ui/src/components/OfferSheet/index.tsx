import { SharedProps } from '../../types';
import { FC, useEffect, useState } from 'react';
import DynamicSheet from '../DynamicSheet';
import { offerSheetAtom } from './store';
import OfferSheetController from './components/OfferSheetController';
import events from '../../utils/amplitude/events';
import { useAtomValue } from 'jotai';
import { usePlatformAdapter } from '../../adapters';
import EventSheetController from './components/EventSheetController';

export type Props = SharedProps & {
  height?: string;
};

const OfferSheet: FC<Props> = () => {
  const platformAdapter = usePlatformAdapter();
  const {
    isOpen,
    offerMeta,
    offerDetails,
    eventDetails,
    amplitudeEvent,
    redemptionType,
    responsiveWeb,
  } = useAtomValue(offerSheetAtom);
  const [currentScrollPos, setCurrentScrollPos] = useState(0);

  useEffect(() => {
    if (
      isOpen &&
      Object.keys(offerMeta).length &&
      Object.keys(offerDetails).length &&
      redemptionType &&
      amplitudeEvent
    ) {
      amplitudeEvent({
        event: events.OFFER_VIEWED,
        params: {
          company_id: String(offerMeta.companyId),
          company_name: offerMeta.companyName,
          offer_id: String(offerMeta.offerId),
          offer_name: offerDetails.name,
          source: 'sheet',
          origin: platformAdapter.platform,
          redemption_type: redemptionType,
        },
      });
    }
  }, [isOpen, offerMeta, offerDetails, amplitudeEvent]);

  useEffect(() => {
    if (
      isOpen &&
      Object.keys(offerMeta).length &&
      Object.keys(eventDetails).length &&
      redemptionType &&
      amplitudeEvent
    ) {
      amplitudeEvent({
        event: events.OFFER_VIEWED,
        params: {
          company_id: String(offerMeta.companyId),
          company_name: offerMeta.companyName,
          offer_id: String(offerMeta.offerId),
          offer_name: eventDetails.name,
          source: 'sheet',
          origin: platformAdapter.platform,
          redemption_type: redemptionType,
        },
      });
    }
  }, [isOpen, offerMeta, eventDetails, amplitudeEvent]);

  // Manage scrollbar when offer sheet opens/closes
  useEffect(() => {
    if (responsiveWeb && window.scrollY > 0) setCurrentScrollPos(window.scrollY);
    if (isOpen) {
      // Disable scrollbar when offer sheet opens
      document.body.style.overflow = 'hidden';
      if (responsiveWeb) document.body.style.position = 'fixed';
    } else {
      // Re-enable scrollbar when offer sheet closes
      document.body.style.overflow = 'visible';
      if (responsiveWeb) {
        document.body.style.position = 'relative';
        window.scrollTo({ top: currentScrollPos, behavior: 'instant' as ScrollBehavior });
      }
    }
  }, [isOpen]);

  return (
    <DynamicSheet showCloseButton containerClassName="flex flex-col justify-between">
      {redemptionType === 'ballot' ? <EventSheetController /> : <OfferSheetController />}
    </DynamicSheet>
  );
};

export default OfferSheet;
