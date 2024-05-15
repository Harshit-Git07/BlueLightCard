import { FC, useEffect, useState } from 'react';
import { IPlatformAdapter, usePlatformAdapter } from '../../adapters';
import { getPlatformExperimentForRedemptionType } from './offerDetailsExperiments';
import { getRedemptionDetails } from '../../api';
import OfferSheet from '../OfferSheet';

type OfferDetailsComponentProps = React.ComponentProps<typeof OfferSheet>;

export const EmptyOfferDetails: FC<OfferDetailsComponentProps> = () => <></>;

export const OfferDetailsLink: FC<OfferDetailsComponentProps> = ({
  isOpen,
  offerDetails,
  onClose,
}) => {
  const platformAdapter = usePlatformAdapter();

  const onOpen = () => {
    platformAdapter.navigate(`/offerdetails.php?cid=${offerDetails?.companyId}`);
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
  const [redemptionType, setRedemptionType] = useState('');

  const getOfferDetailsComponent = (redemptionType: string) => {
    if (!redemptionType) {
      return EmptyOfferDetails;
    }

    const experiment = getPlatformExperimentForRedemptionType(platformAdapter, redemptionType);

    if (!experiment || experiment === 'control') {
      return OfferDetailsLink;
    }

    if (experiment === 'treatment') {
      return OfferSheet;
    }

    return EmptyOfferDetails;
  };

  const updateOfferDetailsComponent = async (offerId: number) => {
    try {
      const redemptionDetails = await getRedemptionDetails(platformAdapter, offerId);
      setRedemptionType(redemptionDetails.data.redemptionType);
    } catch (err) {
      setRedemptionType('default');
    }
  };

  const OfferDetailsComponent = getOfferDetailsComponent(redemptionType);

  return { OfferDetailsComponent, updateOfferDetailsComponent };
};
