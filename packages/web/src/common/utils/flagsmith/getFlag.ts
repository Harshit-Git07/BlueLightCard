import { FlagsmithFeatureFlags } from './flagsmithFlags';
import cookies from 'js-cookie';
import { BRAND } from '@/global-vars';
import { BRANDS } from '../../types/brands.enum';
import { mapBrandToFlagsmithBrand } from './mapBrandToFlagSmithBrand';
import { FeatureFlagBrandKeyValues } from './types';
import flagsmith from '@/utils/flagsmith/flagsmith';

const getFlag = (flagName: FlagsmithFeatureFlags, prioritiseCookie: boolean = true) => {
  if (prioritiseCookie) {
    const cookieValue = cookies.get(flagName);
    if (cookieValue) return cookieValue === 'true' ? true : false;
  }

  let isFlagEnabled: boolean = false;

  const hasFeature = flagsmith.hasFeature(flagName);

  if (hasFeature) {
    const flagValue = flagsmith.getValue(flagName);

    if (flagValue) {
      const flagJSON: FeatureFlagBrandKeyValues =
        typeof flagValue === 'string' ? JSON.parse(flagValue) : null;

      const flagSmithBrand = mapBrandToFlagsmithBrand(BRAND as BRANDS);
      isFlagEnabled = flagJSON ? flagJSON[flagSmithBrand] : false;
    }
  }

  return isFlagEnabled;
};

export default getFlag;
