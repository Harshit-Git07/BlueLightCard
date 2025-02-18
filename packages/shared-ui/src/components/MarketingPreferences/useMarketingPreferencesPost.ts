import { useMutation } from '@tanstack/react-query';
import { MarketingPreferencesData } from './types';
import { covertPostResponseToJson, getStringyPrefsForBraze } from './marketingPreferencesUtils';
import { usePlatformAdapter } from '../../adapters';
import { V5_API_URL } from '../../constants';
import useMemberId from '../../hooks/useMemberId';

const useMarketingPreferencesPost = () => {
  const adapter = usePlatformAdapter();
  const memberId = useMemberId();

  return useMutation({
    mutationFn: async (update: MarketingPreferencesData) => {
      const body = getStringyPrefsForBraze(update);
      try {
        const { status, data } = await adapter.invokeV5Api(
          `${V5_API_URL.BrazePreferences(memberId)}/update`,
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
