import { FC, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import LoadingSpinner from '../../../LoadingSpinner';
import OfferSheetDetailsPage from '../OfferSheetDetailsPage';
import OfferDetailsErrorPage from '../OfferDetailsErrorPage';
import { useAtomValue, useSetAtom } from 'jotai';
import { offerSheetAtom } from '../../store';
import { exhaustiveCheck } from '../../../../utils/exhaustiveCheck';
import { usePlatformAdapter } from '../../../../adapters';
import { getOfferQuery } from '../../../../api';

const OfferSheetController: FC = () => {
  const adapter = usePlatformAdapter();
  const { offerDetails, showRedemptionPage, offerMeta, isOpen } = useAtomValue(offerSheetAtom);
  const setOfferSheetAtom = useSetAtom(offerSheetAtom);
  const cmsFlagResult = adapter.getAmplitudeFeatureFlag('cms-offers');

  const offerQuery = useQuery(
    getOfferQuery(offerMeta.offerId?.toString(), cmsFlagResult === 'on', isOpen),
  );

  useEffect(() => {
    if (offerQuery.isSuccess) {
      setOfferSheetAtom((prev) => ({
        ...prev,
        offerDetails: offerQuery.data,
        offerMeta: {
          offerId: offerMeta.offerId,
          companyId: offerMeta.companyId,
          companyName: offerMeta.companyName,
        },
      }));
    }
  }, [offerQuery.isSuccess]);

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
