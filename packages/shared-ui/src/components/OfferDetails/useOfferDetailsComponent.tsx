import { FC, useEffect, useState } from 'react';
import { Amplitude, IPlatformAdapter, usePlatformAdapter } from '../../adapters';
import { getRedemptionDetails } from '../../api';
import OfferSheet from '../OfferSheet';
import { useAtomValue, useSetAtom } from 'jotai';
import { offerSheetAtom } from '../OfferSheet/store';
import { RedemptionType } from '../OfferSheet/types';
import { PlatformVariant } from '../../types';
import { getPlatformExperimentForRedemptionType } from './offerDetailsExperiments';

type OfferDetailsComponentProps = React.ComponentProps<typeof OfferSheet>;

export const EmptyOfferDetails: FC<OfferDetailsComponentProps> = () => <></>;

export const OfferDetailsLink: FC<OfferDetailsComponentProps> = () => {
  const platformAdapter = usePlatformAdapter();
  const { isOpen, onClose, offerMeta } = useAtomValue(offerSheetAtom);

  const onOpen = () => {
    platformAdapter.navigate(
      `/offerdetails.php?cid=${offerMeta?.companyId}&oid=${offerMeta?.offerId}`,
    );
    onClose();
  };

  useEffect(() => {
    if (isOpen) {
      onOpen();
    }
  }, [isOpen, onOpen]);

  return null;
};

export const useOfferDetailsComponent = (platformAdapter: IPlatformAdapter) => {
  const setOfferSheetAtom = useSetAtom(offerSheetAtom);
  const { redemptionType } = useAtomValue(offerSheetAtom);
  const [experiment, setExperiment] = useState('control');

  function getOfferDetailsComponent(redemptionType: RedemptionType | undefined) {
    const supportedRedemptionTypes = ['vault', 'generic'];
    // Redemptions team added this but when redemption type
    // does not exist it should open legacy page
    // if (!redemptionType) {
    //   return EmptyOfferDetails;
    // }

    if (
      !experiment ||
      experiment === 'control' ||
      !supportedRedemptionTypes.includes(redemptionType || '')
    ) {
      return OfferDetailsLink;
    }

    if (experiment === 'treatment') {
      return OfferSheet;
    }

    return EmptyOfferDetails;
  }

  async function setRedemptionsDetails(offerId: number): Promise<RedemptionType | undefined> {
    try {
      const response = await getRedemptionDetails(platformAdapter, offerId);
      setOfferSheetAtom((prev) => ({
        ...prev,
        redemptionType: response.data.redemptionType,
      }));
      return response.data.redemptionType;
    } catch (err) {
      setOfferSheetAtom((prev) => ({
        ...prev,
        redemptionType: undefined,
      }));
    }
  }

  async function updateOfferDetailsComponent(offerData: {
    offerId: number;
    companyId: number;
    companyName: string;
    platform: PlatformVariant;
    cdnUrl: string;
    BRAND: string;
    isMobileHybrid: boolean;
    height: string;
    amplitudeCtx?: Amplitude | null | undefined;
  }): Promise<void> {
    const redemptionType = await setRedemptionsDetails(offerData.offerId);
    const experiment = getPlatformExperimentForRedemptionType(platformAdapter, redemptionType);
    setExperiment(experiment);
    setOfferSheetAtom((prev) => ({
      ...prev,
      offerMeta: {
        offerId: offerData.offerId,
        companyId: offerData.companyId,
        companyName: offerData.companyName,
      },
      platform: offerData.platform,
      isMobileHybrid: offerData.isMobileHybrid,
      BRAND: offerData.BRAND,
      cdnUrl: offerData.cdnUrl,
      height: offerData.height,
      amplitudeEvent: ({ event, params }) => {
        platformAdapter.logAnalyticsEvent(event, params, offerData?.amplitudeCtx);
      },
    }));
  }

  const OfferDetailsComponent = getOfferDetailsComponent(redemptionType);

  return { OfferDetailsComponent, updateOfferDetailsComponent };
};
