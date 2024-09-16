import { queryOptions } from '@tanstack/react-query';
import { usePlatformAdapter } from '../../../adapters';
import { getRedemptionDetails } from '../../../api/redemptions';
import { RedemptionTypeSchema } from './types';

export function redemptionTypeQuery(offerId: number) {
  const platformAdapter = usePlatformAdapter();

  return queryOptions({
    queryKey: ['redemption details', offerId],
    queryFn: async () => {
      try {
        const res = await getRedemptionDetails(platformAdapter, offerId);
        return RedemptionTypeSchema.parse(res).data.redemptionType;
      } catch {
        return 'unknown'; // TODO: Remove once FS&I is re-platformed
      }
    },

    retry: false,
  });
}
