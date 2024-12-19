import { V5_API_URL } from '@/globals';
import { usePlatformAdapter } from '@bluelightcard/shared-ui';
import { useQuery } from '@tanstack/react-query';
import type { CategoriesData } from '@bluelightcard/shared-ui';
import { experimentsAndFeatureFlags } from '@/components/AmplitudeProvider/store';
import { useAtomValue } from 'jotai';
import { userProfile } from '@/components/UserProfileProvider/store';
import { FeatureFlags } from '@/components/AmplitudeProvider/amplitudeKeys';

const useCategoriesData = () => {
  const amplitudeExperiments = useAtomValue(experimentsAndFeatureFlags);
  const platformAdapter = usePlatformAdapter();
  const profile = useAtomValue(userProfile);

  const v5ApiFlag = amplitudeExperiments[FeatureFlags.V5_API_INTEGRATION] ?? 'off';

  const dob = profile?.dob ?? '';
  const organisation = profile?.organisation ?? '';

  return useQuery({
    queryKey: ['categoriesData', dob, organisation, `v5-${v5ApiFlag}`],
    refetchInterval: false,
    refetchIntervalInBackground: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    retry: false,
    queryFn: async () => {
      const response = await platformAdapter.invokeV5Api(V5_API_URL.Categories, {
        method: 'GET',
        queryParameters: {
          dob,
          organisation,
        },
      });

      if (response.status !== 200)
        throw new Error('Received error when trying to retrieve categories');

      try {
        const categories = JSON.parse(response?.data)?.data as CategoriesData;
        return categories;
      } catch (err) {
        throw new Error('Invalid categories data received');
      }
    },
  });
};

export default useCategoriesData;
