import { IPlatformAdapter } from '../../adapters';
import { PlatformVariant } from '../../types';

export const redemptionTypeExperiments: Record<string, Record<PlatformVariant, string>> = {
  vault: {
    web: 'offer-sheet-redeem-vault-search-and-homepage',
    'mobile-hybrid': 'offer-sheet-redeem-vault-app',
  },
  generic: {
    web: '',
    'mobile-hybrid': 'offer-sheet-redeem-generic-app',
  },
};

export const getPlatformExperimentForRedemptionType = (
  platformAdapter: IPlatformAdapter,
  redemptionType: string,
) => {
  const experimentName =
    redemptionTypeExperiments[redemptionType]?.[platformAdapter.platform as PlatformVariant] ?? '';
  const experiment = platformAdapter.getAmplitudeFeatureFlag(experimentName);

  return experiment;
};
