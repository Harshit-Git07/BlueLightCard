import { V5_API_URL } from '@/globals';
import { excludeEventCategory, usePlatformAdapter } from '@bluelightcard/shared-ui';
import { useQuery } from '@tanstack/react-query';
import type { CategoriesData } from '@bluelightcard/shared-ui';
import { experimentsAndFeatureFlags } from '@/components/AmplitudeProvider/store';
import { useAtomValue } from 'jotai';
import { FeatureFlags } from '@/components/AmplitudeProvider/amplitudeKeys';

const useCategoriesData = () => {
  const amplitudeExperiments = useAtomValue(experimentsAndFeatureFlags);
  const platformAdapter = usePlatformAdapter();

  const v5ApiFlag = amplitudeExperiments[FeatureFlags.V5_API_INTEGRATION] ?? 'off';
  const shouldIncludeEvents =
    amplitudeExperiments[FeatureFlags.ENABLE_EVENTS_AS_OFFERS_HYBRID] === 'on';

  return useQuery({
    queryKey: ['categoriesData', `v5-${v5ApiFlag}`],
    refetchInterval: false,
    refetchIntervalInBackground: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    retry: false,
    queryFn: async () => {
      const response = await platformAdapter.invokeV5Api(V5_API_URL.Categories, {
        method: 'GET',
      });

      if (response.status !== 200)
        throw new Error('Received error when trying to retrieve categories');
      try {
        const categories = JSON.parse(response?.data)?.data as CategoriesData;
        return excludeEventCategory(categories, shouldIncludeEvents);
      } catch (err) {
        throw new Error('Invalid categories data received');
      }
    },
  });
};

export default useCategoriesData;
