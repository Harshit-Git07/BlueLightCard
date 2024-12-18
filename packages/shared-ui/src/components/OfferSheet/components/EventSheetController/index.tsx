import { FC, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import LoadingSpinner from '../../../LoadingSpinner';
import OfferSheetDetailsPage from '../OfferSheetDetailsPage';
import OfferDetailsErrorPage from '../OfferDetailsErrorPage';
import { useAtomValue, useSetAtom } from 'jotai';
import { offerSheetAtom } from '../../store';
import { exhaustiveCheck } from '../../../../utils/exhaustiveCheck';
import { getEventQuery } from '../../../../api';

const EventSheetController: FC = () => {
  const { offerDetails, showRedemptionPage, offerMeta, isOpen } = useAtomValue(offerSheetAtom);
  const setOfferSheetAtom = useSetAtom(offerSheetAtom);

  const eventQuery = useQuery(getEventQuery(offerMeta.offerId?.toString(), isOpen));

  useEffect(() => {
    if (eventQuery.isSuccess) {
      setOfferSheetAtom((prev) => ({
        ...prev,
        eventDetails: eventQuery.data,
      }));
    }
  }, [eventQuery.isSuccess]);

  switch (eventQuery.status) {
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

export default EventSheetController;
