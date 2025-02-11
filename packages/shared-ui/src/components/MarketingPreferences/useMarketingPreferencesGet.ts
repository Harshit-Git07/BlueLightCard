import { useQuery } from '@tanstack/react-query';
import { MarketingPreferencesGetResponse } from './types';

import {
  convertGetResponseToJson,
  marketingPreferencesQueryKey,
} from './marketingPreferencesUtils';
import { usePlatformAdapter } from '../../adapters';
import { V5_API_URL } from '../../constants';
import { PlatformVariant } from '../../types';

const useMarketingPreferencesGet = (memberUuid: string) => {
  const { invokeV5Api, platform } = usePlatformAdapter();
  const marketingPlatform = platform === PlatformVariant.Web ? 'web' : 'mobile';

  return useQuery({
    queryKey: [marketingPreferencesQueryKey],
    queryFn: async (): Promise<MarketingPreferencesGetResponse> => {
      try {
        const { status, data } = await invokeV5Api(
          V5_API_URL.MarketingPreferences(memberUuid, marketingPlatform),
          {
            method: 'GET',
          },
        );

        return convertGetResponseToJson(status, data);
      } catch (e) {
        return convertGetResponseToJson(500, '');
      }
    },
  });
};

export default useMarketingPreferencesGet;
