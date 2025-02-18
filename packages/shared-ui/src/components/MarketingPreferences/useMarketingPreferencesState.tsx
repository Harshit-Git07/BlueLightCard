import { MarketingPreferencesData, marketingPreferencesDefault } from './types';
import { useEffect, useState } from 'react';
import useMarketingPreferencesGet from './useMarketingPreferencesGet';
import useMarketingPreferencesPost from './useMarketingPreferencesPost';
import { useQueryClient } from '@tanstack/react-query';
import { marketingPreferencesQueryKey, optedInKeys } from './marketingPreferencesUtils';

const useMarketingPreferencesState = () => {
  const client = useQueryClient();
  const [savedKeys, setSavedKeys] = useState('');
  const [isBusy, setIsBusy] = useState(false);
  const [preferences, setPreferences] = useState<MarketingPreferencesData>(
    marketingPreferencesDefault(),
  );
  const { isLoading, data: responseData } = useMarketingPreferencesGet();
  const saveMutation = useMarketingPreferencesPost();

  const data = responseData?.data;
  useEffect(() => {
    if (!data) return;
    setPreferences({ ...data });
    setSavedKeys(optedInKeys(data));
  }, [setPreferences, data]);

  const selectedKeys = optedInKeys(preferences);

  const savePreferences = async () => {
    setIsBusy(true);
    const result = await saveMutation.mutateAsync(preferences);
    const success = result.status < 400;
    if (success) {
      setSavedKeys(optedInKeys(preferences));
    } else {
      await revertToSaved();
    }
    setIsBusy(false);
    return success;
  };

  const revertToSaved = () => {
    client.removeQueries({ queryKey: [marketingPreferencesQueryKey] });
    return client.invalidateQueries({ queryKey: [marketingPreferencesQueryKey] });
  };

  const togglePreference = (id: keyof MarketingPreferencesData) => {
    const newPreferences = { ...preferences };
    newPreferences[id] = !preferences[id];
    setPreferences(newPreferences);
  };

  return {
    preferences,
    setPreferences,
    isLoading,
    savePreferences,
    isBusy,
    revertToSaved,
    togglePreference,
    hasChanged: savedKeys !== selectedKeys,
  };
};

export default useMarketingPreferencesState;
