import { SharedProps, PlatformVariant } from '../../types';
import { FC, useEffect, useRef, useState } from 'react';
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

  const componentMounted = useRef(false);

  useEffect(() => {
    // componentMounted is needed to prevent the amplitude event from firing multiple times
    // Root cause seems to be in the ViewOfferProvider component, but was not able to find it.
    // This is a workaround for now that prevents the amplitude event from firing multiple times
    console.log('testing conditions for event to run on useEffect', {
      componentMountedBool: componentMounted.current,
      isOpen,
      offerMeta,
      offerDetails,
      amplitudeEvent,
      amplitudeEventBool: !!amplitudeEvent,
      conditionResult:
        componentMounted.current && isOpen && offerMeta && offerDetails && amplitudeEvent,
    });
    if (componentMounted.current && isOpen && offerMeta && offerDetails && amplitudeEvent) {
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
  }, [componentMounted.current]);

  // Manage scrollbar when offer sheet opens/closes
  // Manage componentMounted to prevent amplitude event from firing multiple times
  useEffect(() => {
    if (isOpen) {
      componentMounted.current = true;
      // Disable scrollbar when offer sheet opens
      document.body.style.overflow = 'hidden';
    } else {
      componentMounted.current = false;
      // Re-enable scrollbar when offer sheet closes
      document.body.style.overflow = 'visible';
    }
  }, [isOpen]);

  return (
    <>
      {/* TODO remove unnecessary props that exist on Jotai like platform and height */}
      <DynamicSheet showCloseButton containerClassName="flex flex-col justify-between">
        <OfferSheetControler />
      </DynamicSheet>
    </>
  );
};

export default OfferSheet;
