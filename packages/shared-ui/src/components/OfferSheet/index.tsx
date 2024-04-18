import { SharedProps, PlatformVariant } from '../../types';
import { FC, useEffect } from 'react';
import DynamicSheet from '../DynamicSheet';
import { useSetAtom } from 'jotai';
import { offerSheetAtom } from './store';
import { OfferDetails, OfferMeta, OfferStatus } from './types';
import OfferSheetControler from './components/OfferSheetControler';

export type Props = SharedProps & {
  isOpen?: boolean;
  offerMeta: OfferMeta | undefined;
  offerDetails: OfferDetails | undefined;
  offerStatus: OfferStatus;
  onClose: () => void;
  height?: string;
  cdnUrl: string;
  isMobileHybrid?: boolean;
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
}) => {
  const setOfferSheetData = useSetAtom(offerSheetAtom);

  useEffect(() => {
    setOfferSheetData((prev) => ({
      ...prev,
      isOpen,
      onClose,
      platform,
      cdnUrl,
      isMobileHybrid: isMobileHybrid || false,
    }));
  }, [isOpen]);

  useEffect(() => {
    if (offerMeta) {
      setOfferSheetData((prev) => ({ ...prev, offerMeta }));
    }
  }, [offerMeta]);

  useEffect(() => {
    if (offerDetails) {
      setOfferSheetData((prev) => ({ ...prev, offerDetails }));
    }
  }, [offerDetails]);

  return (
    <DynamicSheet
      platform={platform}
      showCloseButton
      containerClassName="flex flex-col justify-between"
      height={height}
    >
      <OfferSheetControler offerStatus={offerStatus} />
    </DynamicSheet>
  );
};

export default OfferSheet;
