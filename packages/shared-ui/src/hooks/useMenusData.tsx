import type { MenusData } from '../types';
import { V5_API_URL } from '../constants';
import { usePlatformAdapter } from '../adapters';
import { useSuspenseQuery } from '@tanstack/react-query';

const useMenusData = (
  user: { dob: string; organisation: string },
  menuIds: Array<keyof MenusData> = [],
) => {
  const platformAdapter = usePlatformAdapter();

  return useSuspenseQuery({
    queryKey: ['menuData', menuIds, user.dob, user.organisation],
    refetchInterval: false,
    refetchIntervalInBackground: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    retry: false,
    queryFn: async () => {
      const queryParameters: { id?: string; dob: string; organisation: string } = {
        dob: user.dob,
        organisation: user.organisation,
      };
      if (menuIds.length) queryParameters.id = menuIds.join(',');

      const response = await platformAdapter.invokeV5Api(V5_API_URL.Menus, {
        method: 'GET',
        queryParameters,
      });

      if (response.status !== 200) throw new Error('Received error when trying to retrieve menus');

      try {
        const menus = JSON.parse(response?.data)?.data as MenusData;
        return menus;
      } catch (err) {
        throw new Error('Invalid menus data received');
      }
    },
  });
};

export default useMenusData;
