import { FC, useEffect, useState } from 'react';
import { IPlatformAdapter, usePlatformAdapter } from '../../adapters';
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
  const [experiment, setExperiment] = useState('control');
  const [redemptionType, setRedemptionType] = useState('');

  const getOfferDetailsComponent = (experiment: string, redemptionType: string) => {
    if (redemptionType === 'vault' && experiment === 'treatment') {
      return OfferSheet;
    }

    if (redemptionType !== '') {
      return OfferDetailsLink;
    }

    return EmptyOfferDetails;
  };

  const updateOfferDetailsComponent = async (experiment: string, offerId: number) => {
    setExperiment(experiment);

    try {
      const redemptionDetails = await getRedemptionDetails(platformAdapter, offerId);
      setRedemptionType(redemptionDetails.data.redemptionType);
    } catch (err) {
      setRedemptionType('default');
    }
  };

  const OfferDetailsComponent = getOfferDetailsComponent(experiment, redemptionType);

  return { OfferDetailsComponent, updateOfferDetailsComponent };
};
