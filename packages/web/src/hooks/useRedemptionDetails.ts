import AuthContext from '@/context/Auth/AuthContext';
import { REDEMPTION_DETAILS_ENDPOINT } from '@/global-vars';
import { RedemptionDetailsResponse, RedemptionDetailsResponseSchema } from '@/types/api';
import { UseQueryResult, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useContext } from 'react';

export function useRedemptionDetails(
  offerId: number
): UseQueryResult<RedemptionDetailsResponse, Error> {
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
        .then((res) => RedemptionDetailsResponseSchema.parse(res.data)),
  });
}
