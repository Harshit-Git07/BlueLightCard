import { UseQueryResult, useQuery } from '@tanstack/react-query';
import { usePlatformAdapter } from '../adapters';
import { OfferData, getOffer } from '../api';

export type useOfferDetailsOptions = {
  offerId: number | string;
};

// TODO: DEPRECATED - DO NOT USE. USE useQueryCustomHook() instead.
// BE SURE TO CHECK IF THIS FILE CAN BE REMOVED BEFORE MERGING IN STAGING
export function useOfferDetails(options: useOfferDetailsOptions): UseQueryResult<OfferData, Error> {
  const adapter = usePlatformAdapter();

  return useQuery({
    queryKey: ['offerDetails', options.offerId],
    queryFn: async () => getOffer(adapter, options.offerId),
    refetchInterval: false,
    refetchIntervalInBackground: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    retry: false,
    enabled: !!options.offerId,
  });
}
