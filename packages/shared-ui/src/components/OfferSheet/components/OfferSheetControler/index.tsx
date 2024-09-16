import { FC, useEffect } from 'react';
import LoadingSpinner from '../../../LoadingSpinner';
import OfferSheetDetailsPage from '../OfferSheetDetailsPage';
import OfferDetailsErrorPage from '../OfferDetailsErrorPage';
import { useAtomValue, useSetAtom } from 'jotai';
import { offerSheetAtom } from '../../store';
import { exhaustiveCheck } from '../../../../utils/exhaustiveCheck';
import { useOfferDetails } from '../../../../hooks/useOfferDetails';
import { OfferDetails } from '../../types';

const OfferSheetController: FC = () => {
  const { offerDetails, showRedemptionPage, offerMeta } = useAtomValue(offerSheetAtom);
  const setOfferSheetAtom = useSetAtom(offerSheetAtom);
  const offerQuery = useOfferDetails({
    offerId: offerMeta.offerId!,
  });

  useEffect(() => {
    if (offerQuery.status === 'success') {
      setOfferSheetAtom((prev) => ({
        ...prev,
        offerDetails: offerQuery.data as OfferDetails,
        offerMeta: {
          offerId: offerMeta.offerId,
          companyId: offerMeta.companyId,
          companyName: offerMeta.companyName,
        },
      }));
    }
  }, [offerQuery.status]);
  switch (offerQuery.status) {
    case 'pending':
      if (showRedemptionPage) {
        // set OfferSheet to initial screen
        setOfferSheetAtom((prev) => ({ ...prev, showRedemptionPage: false }));
      }
      return (
        <LoadingSpinner containerClassName="text-palette-primary" spinnerClassName="text-[5em]" />
      );
    case 'error':
      return <OfferDetailsErrorPage />;
    case 'success':
      return <OfferSheetDetailsPage />;
    default:
      exhaustiveCheck(offerDetails as never);
  }
};

export default OfferSheetController;
