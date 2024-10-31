import { FC, useEffect } from 'react';
import LoadingSpinner from '../../../LoadingSpinner';
import OfferSheetDetailsPage from '../OfferSheetDetailsPage';
import OfferDetailsErrorPage from '../OfferDetailsErrorPage';
import { useAtomValue, useSetAtom } from 'jotai';
import { offerSheetAtom } from '../../store';
import { exhaustiveCheck } from '../../../../utils/exhaustiveCheck';
import { OfferDetails } from '../../types';
import { useQueryCustomHook } from '../../../../hooks/useQueryCustomHook';
import { apiRequest, CMS_SERVICES } from '../../../../services/apiRequestService';
import { usePlatformAdapter } from '../../../../adapters';

const OfferSheetController: FC = () => {
  const adapter = usePlatformAdapter();
  const { offerDetails, showRedemptionPage, offerMeta, isOpen } = useAtomValue(offerSheetAtom);
  const setOfferSheetAtom = useSetAtom(offerSheetAtom);
  const cmsFlagResult = adapter.getAmplitudeFeatureFlag('cms-offers');

  const offerQuery = useQueryCustomHook({
    enabled: !!offerMeta.offerId && isOpen,
    queryKeyArr: ['offerDetails', offerMeta.offerId?.toString() as string],
    queryFnCall: async () =>
      apiRequest({
        service: CMS_SERVICES.OFFER_DETAILS_DATA,
        adapter,
        offerId: offerMeta.offerId?.toString() as string,
        isCmsFlagOn: cmsFlagResult === 'on',
      }),
  });

  useEffect(() => {
    if (offerQuery.isSuccess) {
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
