import { z } from 'zod';
import { queryOptions } from '@tanstack/react-query';
import { usePlatformAdapter } from '../index';

const userResponseModel = z.object({
  message: z.string(),
  data: z.object({
    canRedeemOffer: z.boolean().nullable(),
  }),
});

export function userQuery() {
  const platformAdapter = usePlatformAdapter();

  return queryOptions({
    queryKey: ['user'],
    queryFn: async () => {
      const result = await platformAdapter.invokeV5Api('/eu/identity/user', {
        method: 'GET',
      });

      return userResponseModel.parse(JSON.parse(result.data)).data;
    },
  });
}
