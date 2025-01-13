import { usePlatformAdapter } from '../adapters';
import { useQuery } from '@tanstack/react-query';
import { jsonOrNull } from '../utils/jsonUtils';
import { Organisation } from '../api/types';
import { V5_API_URL } from '../constants';

export const useGetOrganisation = (orgId?: string) => {
  const url = V5_API_URL.Organisation(orgId);
  const platformAdapter = usePlatformAdapter();

  return useQuery({
    queryKey: ['/members/orgs', orgId],
    enabled: !!orgId,
    queryFn: async () => {
      console.log(url);
      const { status, data: rawApiResponse } = await platformAdapter.invokeV5Api(url, {
        method: 'GET',
      });

      if (status < 400) {
        return jsonOrNull<Organisation>(rawApiResponse);
      }

      return null;
    },
    staleTime: 1000 * 60 * 10,
  });
};
