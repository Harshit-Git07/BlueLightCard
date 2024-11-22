import { useQuery } from '@tanstack/react-query';
import { MarketingPreferencesGetResponse } from './MarketingPreferencesTypes';
import {
  convertGetResponseToJson,
  getMarketingPreferencesUrl,
  marketingPreferencesQueryKey,
} from './marketingPreferencesUtils';
import { usePlatformAdapter } from '../../adapters';

const useMarketingPreferencesGet = (memberUuid: string) => {
  const adapter = usePlatformAdapter();
  return useQuery({
    queryKey: [marketingPreferencesQueryKey],
    queryFn: async (): Promise<MarketingPreferencesGetResponse> => {
      try {
        const { status, data } = await adapter.invokeV5Api(getMarketingPreferencesUrl(memberUuid), {
          method: 'GET',
          queryParameters: { preferenceType: 'marketing' },
        });
        return convertGetResponseToJson(status, data);
      } catch (e) {
        return convertGetResponseToJson(500, '');
      }
    },
  });
};

export default useMarketingPreferencesGet;
