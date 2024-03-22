import { OfferMeta } from '@/context/OfferSheet/OfferSheetContext';
import LoadingSpinner from '@/offers/components/LoadingSpinner/LoadingSpinner';
import { OfferDetailsErrorPage } from './OfferDetailsPage/OfferDetailsErrorPage';
import { OfferDetailsPage } from './OfferDetailsPage/OfferDetailsPage';
import { useOfferDetails, useRedemptionType } from './hooks';
import { exhaustiveCheck } from '@core/utils/exhaustiveCheck';

type Props = {
  offerMeta: OfferMeta;
};

export function OfferSheetController({ offerMeta }: Props) {
  const offerDetails = useOfferDetails(offerMeta);
  const redemptionType = useRedemptionType(offerMeta);

  switch (offerDetails.status) {
    case 'pending':
      return (
        <LoadingSpinner containerClassName="text-palette-primary" spinnerClassName="text-[5em]" />
      );
    case 'error':
      return <OfferDetailsErrorPage offer={offerMeta} />;
    case 'success':
      return (
        <OfferDetailsPage
          offerMeta={offerMeta}
          offerData={offerDetails.data}
          redemptionType={redemptionType}
        />
      );
    default:
      exhaustiveCheck(offerDetails);
  }
}
