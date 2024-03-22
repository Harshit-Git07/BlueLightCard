import AmplitudeContext from '@/context/AmplitudeContext';
import UserContext from '@/context/User/UserContext';
import { logOfferView } from '@/utils/amplitude/logOfferView';
import { useRouter } from 'next/router';
import { useCallback, useContext } from 'react';

export type UseLogOfferViewParams = {
  offerId: string;
  offerName?: string;
  companyId: string;
  companyName: string;
};

export function useLogOfferView() {
  const router = useRouter();
  const userCtx = useContext(UserContext);
  const amplitude = useContext(AmplitudeContext);

  return useCallback(
    (eventSource: string, params: UseLogOfferViewParams) => {
      logOfferView({
        amplitude,
        userUuid: userCtx.user?.uuid,
        eventSource,
        origin: router.route,
        offerId: params.offerId,
        offerName: params.offerName,
        companyId: params.companyId,
        companyName: params.companyName,
      });
    },
    [amplitude, userCtx.user?.uuid, router.route]
  );
}
