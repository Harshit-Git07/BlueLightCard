import { useEffect, useState } from 'react';
import { BRANDS } from '@/types/brands.enum';
import { FlagsmithFeatureFlags } from '@/utils/flagsmith/flagsmithFlags';
import { mapBrandToFlagsmithBrand } from '@/utils/flagsmith/mapBrandToFlagSmithBrand';
import { FeatureFlagBrandKeyValues } from '@/utils/flagsmith/types';
import { useFlags } from 'flagsmith/react';
import { BRAND } from '@/global-vars';
import cookies from 'js-cookie';

const useFeatureFlag = (flagName: FlagsmithFeatureFlags, prioritiseCookie = true) => {
  const [isFlagEnabled, setFlagEnabled] = useState<boolean>(false);
  const flags = useFlags([flagName]);

  useEffect(() => {
    if (prioritiseCookie) {
      const cookieValue = cookies.get(flagName);
      if (cookieValue) setFlagEnabled(cookieValue === 'true' ? true : false);
    }

    const flagValue = flags[flagName] && flags[flagName].enabled && flags[flagName].value;

    if (flagValue) {
      const flagJSON: FeatureFlagBrandKeyValues =
        typeof flagValue === 'string' ? JSON.parse(flagValue) : null;

      const flagSmithBrand = mapBrandToFlagsmithBrand(BRAND as BRANDS);
      setFlagEnabled(flagJSON ? flagJSON[flagSmithBrand] : false);
    }
  }, [flagName, flags, isFlagEnabled, prioritiseCookie]);

  return isFlagEnabled;
};

export default useFeatureFlag;
