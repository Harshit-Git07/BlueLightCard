import { V5_API_URL } from '@/globals/apiUrl';
import { usePlatformAdapter } from '@bluelightcard/shared-ui';
import { useSuspenseQuery } from '@tanstack/react-query';
import type { FlexibleOfferData } from '@bluelightcard/shared-ui';
import { useContext } from 'react';
import UserContext from '../context/User/UserContext';

const useFlexibleOffersData = (flexiMenuId: string) => {
  const platformAdapter = usePlatformAdapter();
  const userCtx = useContext(UserContext);

  if (!flexiMenuId || flexiMenuId === '' || flexiMenuId === 'undefined')
    throw new Error('Valid flexi menu ID not provided');

  if (!userCtx.user || userCtx.error) throw new Error('Valid user profile not provided');

  const dob = userCtx.user?.profile.dob ?? '';
  const organisation = userCtx.user?.profile.organisation ?? '';

  return useSuspenseQuery({
    queryKey: ['flexibleOffersData', flexiMenuId, dob, organisation],
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
          queryParameters: {
            dob,
            organisation,
          },
        }
      );

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
