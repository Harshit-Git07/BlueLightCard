import { V5_API_URL } from '@/globals/apiUrl';
import { usePlatformAdapter } from '@bluelightcard/shared-ui';
import { useSuspenseQuery } from '@tanstack/react-query';
import type { FlexibleOfferData } from '@bluelightcard/shared-ui';

const useFlexibleOffersData = (flexiMenuId: string) => {
  const platformAdapter = usePlatformAdapter();

  if (!flexiMenuId || flexiMenuId === '') throw new Error('Valid flexi menu ID not provided');

  return useSuspenseQuery({
    queryKey: ['flexibleOffersData', flexiMenuId],
    refetchInterval: false,
    refetchIntervalInBackground: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    retry: false,
    queryFn: async () => {
      const response = await platformAdapter.invokeV5Api(V5_API_URL.FlexibleOffers, {
        method: 'GET',
        queryParameters: {
          id: flexiMenuId,
        },
      });

      if (response.status !== 200)
        throw new Error('Received error when trying to retrieve flexible offers');

      try {
        const flexibleOffers = JSON.parse(response?.data)?.data as FlexibleOfferData;
        return flexibleOffers;
      } catch (err) {
        throw new Error('Invalid flexible offers data received');
      }
    },
  });
};

export default useFlexibleOffersData;
