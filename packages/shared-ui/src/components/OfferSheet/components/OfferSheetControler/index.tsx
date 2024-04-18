import { FC } from 'react';
import LoadingSpinner from '../../../LoadingSpinner';
import OfferSheetDetailsPage from '../OfferSheetDetailsPage';
import OfferDetailsErrorPage from '../OfferDetailsErrorPage';
import { OfferStatus } from '../../types';
import { exhaustiveCheck } from '../../../../utils/exhaustiveCheck';
import { useAtomValue, useSetAtom } from 'jotai';
import { offerSheetAtom } from '../../store';

export type Props = {
  offerStatus: OfferStatus | undefined;
};

const OfferSheetControler: FC<Props> = ({ offerStatus }) => {
  const { offerDetails, showRedemptionPage } = useAtomValue(offerSheetAtom);
  const setOfferSheetAtom = useSetAtom(offerSheetAtom);

  switch (offerStatus) {
    case 'pending': {
      if (showRedemptionPage) {
        // set OfferSheet to initial screen
        setOfferSheetAtom((prev) => ({ ...prev, showRedemptionPage: false }));
      }
      return (
        <LoadingSpinner containerClassName="text-palette-primary" spinnerClassName="text-[5em]" />
      );
    }
    case 'error':
      return <OfferDetailsErrorPage />;
    case 'success':
      return <OfferSheetDetailsPage />;
    default:
      exhaustiveCheck(offerDetails as never);
  }
};

export default OfferSheetControler;
