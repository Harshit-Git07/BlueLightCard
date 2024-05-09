import AuthContext from '@/context/Auth/AuthContext';
import { OfferMeta } from '@/context/OfferSheet/OfferSheetContext';
import { REDEEM_ENDPOINT } from '@/global-vars';
import { useLogVaultCodeRequestClicked } from '@/hooks/useLogVaultCodeRequestClicked';
import { OfferData } from '@/types/api/offers';
import { RedeemData, RedeemResponseSchema, RedemptionType } from '@/types/api/redemptions';
import { getOfferById } from '@/utils/offers/getOffer';
import { UseQueryResult, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useContext } from 'react';

export function useOfferDetails(offer: OfferMeta) {
  const authCtx = useContext(AuthContext);

  return useQuery({
    queryKey: ['offerDetails', authCtx.authState.idToken, offer?.offerId],
    queryFn: () => getOfferById(authCtx.authState.idToken, offer?.offerId),
    enabled: !!offer?.offerId,
    retry: false,
  });
}

export function useLabels(offerData: OfferData) {
  return [offerData.type, `Expiry: ${offerData.expiry}`].filter(Boolean);
}

export type UseRedeemData =
  | {
      redemptionType: 'legacy';
    }
  | RedeemData;
export function useRedeemOffer(
  offerMeta: OfferMeta,
  offerData: OfferData
): UseQueryResult<UseRedeemData, Error> {
  const logVaultCodeRequestClicked = useLogVaultCodeRequestClicked({
    companyId: offerMeta.companyId,
    companyName: offerMeta.companyName,
    offerId: offerMeta.offerId,
    offerName: offerData.name,
  });
  const authCtx = useContext(AuthContext);
  const authToken = authCtx.authState.idToken;

  return useQuery({
    queryKey: ['redeemOffer', offerData.id],
    queryFn: async () => {
      logVaultCodeRequestClicked('sheet');
      const response = await axios.request({
        url: REDEEM_ENDPOINT,
        method: 'POST',
        data: {
          offerId: offerData.id,
          offerName: offerData.name ?? offerMeta.companyName,
          companyName: offerMeta.companyName,
        },
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      return RedeemResponseSchema.parse(response.data).data;
    },
    refetchInterval: false,
    refetchIntervalInBackground: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    retry: false,
  });
}
