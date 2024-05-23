import { SharedProps } from '../../types';
import { FC, useEffect } from 'react';
import DynamicSheet from '../DynamicSheet';
import { offerSheetAtom } from './store';
import OfferSheetControler from './components/OfferSheetControler';
import events from '../../utils/amplitude/events';
import { useAtomValue } from 'jotai';
import { usePlatformAdapter } from '../../adapters';

export type Props = SharedProps & {
  height?: string;
};

const OfferSheet: FC<Props> = () => {
  const platformAdapter = usePlatformAdapter();
  const { isOpen, offerMeta, offerDetails, amplitudeEvent, redemptionType } =
    useAtomValue(offerSheetAtom);

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
      <DynamicSheet showCloseButton containerClassName="flex flex-col justify-between">
        <OfferSheetControler />
      </DynamicSheet>
    </>
  );
};

export default OfferSheet;
