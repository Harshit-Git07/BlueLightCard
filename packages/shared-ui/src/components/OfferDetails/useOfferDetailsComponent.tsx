import { FC, useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAtomValue, useSetAtom } from 'jotai';
import OfferSheet from '../OfferSheet';
import { getPlatformExperimentForRedemptionType } from './offerDetailsExperiments';
import { offerSheetAtom } from '../OfferSheet/store';
import { RedemptionType } from '../OfferSheet/types';
import { Amplitude, IPlatformAdapter, usePlatformAdapter } from '../../adapters';
import { getRedemptionDetails, getOfferQuery } from '../../api';
import { PlatformVariant } from '../../types';

type OfferDetailsComponentProps = React.ComponentProps<typeof OfferSheet>;

export const EmptyOfferDetails: FC<OfferDetailsComponentProps> = () => <></>;

export const OfferDetailsLink: FC<OfferDetailsComponentProps> = () => {
  const platformAdapter = usePlatformAdapter();
  const { isOpen, onClose, offerMeta } = useAtomValue(offerSheetAtom);
  const cmsFlagResult = platformAdapter.getAmplitudeFeatureFlag('cms-offers');

  const offerQuery = useQuery(
    getOfferQuery(offerMeta.offerId?.toString(), cmsFlagResult === 'on', isOpen),
  );

  const onOpen = () => {
    const offerIdParam = offerQuery?.data ? `&oid=${offerMeta.offerId}` : '';
    platformAdapter.navigate(`/offerdetails.php?cid=${offerMeta?.companyId}${offerIdParam}`);
    onClose();
  };

  useEffect(() => {
    if (isOpen && offerQuery.isFetched) {
      onOpen();
    }
  }, [isOpen, onOpen, offerQuery.isFetched]);

  return null;
};

export const useOfferDetailsComponent = (platformAdapter: IPlatformAdapter) => {
  const setOfferSheetAtom = useSetAtom(offerSheetAtom);
  const [experiment, setExperiment] = useState('control');

  function getOfferDetailsComponent() {
    if (!experiment || experiment === 'control') {
      return OfferDetailsLink;
    }

    if (experiment === 'treatment' || experiment === 'on') {
      return OfferSheet;
    }

    return EmptyOfferDetails;
  }

  async function setRedemptionsDetails(
    offerId: number | string,
  ): Promise<RedemptionType | undefined> {
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
    offerId: number | string;
    companyId: number | string;
    companyName: string;
    platform: PlatformVariant;
    amplitudeCtx?: Amplitude | null;
    responsiveWeb?: boolean;
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
      platform: platformAdapter.platform,
      amplitudeEvent: ({ event, params }) => {
        platformAdapter.logAnalyticsEvent(event, params, offerData?.amplitudeCtx);
      },
      responsiveWeb: offerData.responsiveWeb,
    }));
  }

  const OfferDetailsComponent = getOfferDetailsComponent();

  return { OfferDetailsComponent, updateOfferDetailsComponent };
};
