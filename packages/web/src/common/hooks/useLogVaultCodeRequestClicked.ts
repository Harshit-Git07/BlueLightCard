import AmplitudeContext from '@/context/AmplitudeContext';
import UserContext from '@/context/User/UserContext';
import { logVaultCodeRequestClicked } from '@/utils/amplitude/logVaultCodeRequestClicked';
import { useRouter } from 'next/router';
import { useCallback, useContext } from 'react';

export type UseLogVaultCodeRequestClickedParams = {
  offerId: number;
  offerName?: string;
  companyId: number;
  companyName: string;
};

export function useLogVaultCodeRequestClicked({
  offerId,
  offerName,
  companyId,
  companyName,
}: UseLogVaultCodeRequestClickedParams) {
  const router = useRouter();
  const userCtx = useContext(UserContext);
  const amplitude = useContext(AmplitudeContext);

  return useCallback(
    (eventSource: string) => {
      logVaultCodeRequestClicked({
        amplitude,
        userUuid: userCtx.user?.uuid,
        eventSource,
        origin: router.route,
        offerId: offerId,
        offerName,
        companyId,
        companyName,
      });
    },
    [amplitude, userCtx.user?.uuid, router.route, offerId, offerName, companyId, companyName]
  );
}
