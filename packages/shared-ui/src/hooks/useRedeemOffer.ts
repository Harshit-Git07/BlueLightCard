import { UseQueryResult, useQuery } from '@tanstack/react-query';
import { usePlatformAdapter } from '../adapters';
import { RedeemResponse, redeemOffer } from '../api/redemptions';

export type UseRedeemOfferOptions = {
  offerId: number;
  offerName: string;
  companyName: string;
};

export function useRedeemOffer(
  options: UseRedeemOfferOptions,
): UseQueryResult<RedeemResponse, Error> {
  const adapter = usePlatformAdapter();

  return useQuery({
    queryKey: ['redeemOffer', options.offerId],
    queryFn: async () =>
      redeemOffer(adapter, options.offerId, options.offerName, options.companyName),
    refetchInterval: false,
    refetchIntervalInBackground: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    retry: false,
  });
}
