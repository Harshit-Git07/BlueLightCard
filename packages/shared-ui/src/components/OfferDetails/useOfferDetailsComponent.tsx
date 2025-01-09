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
  const { offerMeta, redemptionType } = useAtomValue(offerSheetAtom);
  const [experiment, setExperiment] = useState('control');
  const brand = process.env.NEXT_PUBLIC_APP_BRAND;
  const fsiCompanyIdsEnv = process.env.NEXT_PUBLIC_FSI_COMPANY_IDS?.trim()
    .split(', ')
    ?.filter(Boolean);
  let fsiCompanyIds;
  let isFsi = false;

  if (fsiCompanyIdsEnv && fsiCompanyIdsEnv.length > 0) {
    fsiCompanyIds = fsiCompanyIdsEnv.map((i) => Number(i));
  }

  if (fsiCompanyIds) {
    isFsi = fsiCompanyIds.includes(Number(offerMeta.companyId));
  }

  function getOfferDetailsComponent() {
    // if the current offer is FS&I -> redirect to legacy page (OfferDetailsLink component)
    if (isFsi) {
      return OfferDetailsLink;
    }
    // If the experiment is in the 'treatment' group or is 'on' -> return the OfferSheet component
    // OR if there's no redemption type provided by the API (400 error) for BLC_UK only -> return the OfferSheet
    // component and display error page in OfferSheet
    if (
      experiment === 'treatment' ||
      experiment === 'on' ||
      (!redemptionType && brand === 'blc-uk')
    ) {
      return OfferSheet;
    }

    // If there is no experiment or the experiment is in the 'control' group -> redirect to legacy page (OfferDetailsLink component)
    if (!experiment || experiment === 'control') {
      return OfferDetailsLink;
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
