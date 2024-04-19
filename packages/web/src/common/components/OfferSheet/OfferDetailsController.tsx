import { OfferMeta } from '@/context/OfferSheet/OfferSheetContext';
import LoadingSpinner from '@/offers/components/LoadingSpinner/LoadingSpinner';
import { OfferDetailsErrorPage } from './OfferDetailsPage/OfferDetailsErrorPage';
import { OfferDetailsPage } from './OfferDetailsPage/OfferDetailsPage';
import { useOfferDetails } from './hooks';
import { useRedemptionDetails } from '../../hooks/useRedemptionDetails';

type Props = {
  offerMeta: OfferMeta;
};

export function OfferSheetController({ offerMeta }: Props) {
  const offerDetails = useOfferDetails(offerMeta);
  const redemptionDetails = useRedemptionDetails(offerMeta.offerId);

  if (offerDetails.status === 'pending' || redemptionDetails.status === 'pending') {
    return (
      <LoadingSpinner containerClassName="text-palette-primary" spinnerClassName="text-[5em]" />
    );
  }

  if (offerDetails.status === 'error' || redemptionDetails.status === 'error') {
    return <OfferDetailsErrorPage offer={offerMeta} />;
  }

  return (
    <OfferDetailsPage
      offerMeta={offerMeta}
      offerData={offerDetails.data}
      redemptionType={redemptionDetails.data.data.redemptionType}
    />
  );
}
