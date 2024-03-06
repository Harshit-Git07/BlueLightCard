import AuthContext from '@/context/Auth/AuthContext';
import { REDEMPTION_DETAILS_ENDPOINT } from '@/global-vars';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useContext } from 'react';

export function useRedemptionDetails(offerId: number) {
  const authCtx = useContext(AuthContext);
  const authToken = authCtx.authState.idToken;

  return useQuery({
    queryKey: ['redemptionDetails', offerId, authToken],
    queryFn: () =>
      axios
        .request({
          url: REDEMPTION_DETAILS_ENDPOINT,
          method: 'POST',
          data: {
            offerId,
          },
          headers: {
            Authorization: authToken,
          },
        })
        .then((res) => res.data),
  });
}
