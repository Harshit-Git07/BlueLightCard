import { IPlatformAdapter } from '../../adapters';
import { PlatformVariant } from '../../types';
import { RedemptionType } from '../OfferSheet/types';

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

type Experiment = 'control' | 'treatment' | string;

export const getPlatformExperimentForRedemptionType = (
  platformAdapter: IPlatformAdapter,
  redemptionType: RedemptionType | undefined,
) => {
  const experimentName =
    redemptionTypeExperiments[redemptionType ?? '']?.[
      platformAdapter.platform as PlatformVariant
    ] ?? '';
  const experiment = platformAdapter.getAmplitudeFeatureFlag(experimentName) ?? 'control';

  return experiment as Experiment;
};
