import { useMutation } from '@tanstack/react-query';
import { MarketingPreferencesData } from './types';
import { covertPostResponseToJson, getStringyPrefsForBraze } from './marketingPreferencesUtils';
import { usePlatformAdapter } from '../../adapters';
import { V5_API_URL } from '../../constants';

const useMarketingPreferencesPost = (memberUuid: string) => {
  const adapter = usePlatformAdapter();
  return useMutation({
    mutationFn: async (update: MarketingPreferencesData) => {
      const body = getStringyPrefsForBraze(update);
      try {
        const { status, data } = await adapter.invokeV5Api(
          `${V5_API_URL.BrazePreferences(memberUuid)}/update`,
          {
            method: 'POST',
            body: JSON.stringify(body),
          },
        );

        return covertPostResponseToJson(status, data);
      } catch (err) {
        return covertPostResponseToJson(500, 'Unknown error occurred');
      }
    },
  });
};

export default useMarketingPreferencesPost;
