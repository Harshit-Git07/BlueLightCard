import { V5_API_URL } from '@/globals';
import { mapFlexibleEventsToOffers, usePlatformAdapter } from '@bluelightcard/shared-ui';
import { useSuspenseQuery } from '@tanstack/react-query';
import type { FlexibleOfferData } from '@bluelightcard/shared-ui';
import { experimentsAndFeatureFlags } from '@/components/AmplitudeProvider/store';
import { useAtomValue } from 'jotai';
import { FeatureFlags } from '@/components/AmplitudeProvider/amplitudeKeys';

const useFlexibleOffersData = (flexiMenuId: string) => {
  const amplitudeExperiments = useAtomValue(experimentsAndFeatureFlags);
  const platformAdapter = usePlatformAdapter();

  const v5ApiFlag = amplitudeExperiments[FeatureFlags.V5_API_INTEGRATION] ?? 'off';

  if (!flexiMenuId || flexiMenuId === 'undefined') {
    throw new Error('Valid flexi menu ID not provided');
  }

  return useSuspenseQuery({
    queryKey: ['flexibleOffersData', flexiMenuId, `v5-${v5ApiFlag}`],
    refetchInterval: false,
    refetchIntervalInBackground: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    retry: false,
    queryFn: async () => {
      const response = await platformAdapter.invokeV5Api(
        V5_API_URL.FlexibleOffers + `/${flexiMenuId}`,
        {
          method: 'GET',
        },
      );

      if (response.status !== 200)
        throw new Error('Received error when trying to retrieve flexible offers');

      try {
        const flexibleOffers = JSON.parse(response?.data)?.data as FlexibleOfferData;
        return mapFlexibleEventsToOffers(flexibleOffers);
      } catch (err) {
        throw new Error('Invalid flexible offers data received');
      }
    },
  });
};

export default useFlexibleOffersData;
