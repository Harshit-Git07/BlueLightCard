import { usePlatformAdapter } from '../adapters';
import { useQuery } from '@tanstack/react-query';
import { jsonOrNull } from '../utils/jsonUtils';
import { V5_API_URL } from '../constants';
import { Employer } from '../api/types';

type GetEmployersApiResponse = Array<Employer>;

export const useGetEmployers = (orgId?: string) => {
  const url = V5_API_URL.Employers(orgId);
  const platformAdapter = usePlatformAdapter();

  return useQuery({
    queryKey: ['/members/orgs', orgId, '/employers'],
    enabled: !!orgId,
    queryFn: async () => {
      const { status, data: rawApiResponse } = await platformAdapter.invokeV5Api(url, {
        method: 'GET',
      });

      if (status < 400) {
        return jsonOrNull<GetEmployersApiResponse>(rawApiResponse);
      }

      return null;
    },
    staleTime: 1000 * 60 * 10,
  });
};
