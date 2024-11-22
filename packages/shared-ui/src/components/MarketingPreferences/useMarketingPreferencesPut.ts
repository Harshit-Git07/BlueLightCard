import { useMutation } from '@tanstack/react-query';
import { MarketingPreferencesData } from './MarketingPreferencesTypes';
import {
  covertPutResponseToJson,
  getMarketingPreferencesUrl,
  getStringyPrefsForBlaze,
} from './marketingPreferencesUtils';
import { usePlatformAdapter } from '../../adapters';

const useMarketingPreferencesPut = (memberUuid: string) => {
  const adapter = usePlatformAdapter();
  return useMutation({
    mutationFn: async (update: MarketingPreferencesData) => {
      const body = getStringyPrefsForBlaze(update);
      try {
        const { status, data } = await adapter.invokeV5Api(getMarketingPreferencesUrl(memberUuid), {
          method: 'PUT',
          body: JSON.stringify(body),
        });

        return covertPutResponseToJson(status, data);
      } catch (err) {
        return covertPutResponseToJson(500, 'Unknown error occurred');
      }
    },
  });
};

export default useMarketingPreferencesPut;
