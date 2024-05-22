import { IPlatformAdapter } from '../../adapters';
import { PlatformVariant } from '../../types';
import { RedemptionType } from '../OfferSheet/types';

export const redemptionTypeExperiments: Record<string, Record<PlatformVariant, string | null>> = {
  vault: {
    [PlatformVariant.Web]: 'offer-sheet-redeem-vault-search-and-homepage',
    [PlatformVariant.MobileHybrid]: 'offer-sheet-redeem-vault-app',
  },
  generic: {
    [PlatformVariant.Web]: null,
    [PlatformVariant.MobileHybrid]: 'offer-sheet-redeem-generic-app',
  },
};

type Experiment = 'control' | 'treatment' | string;

export const getPlatformExperimentForRedemptionType = (
  platformAdapter: IPlatformAdapter,
  redemptionType: RedemptionType | undefined,
) => {
  if (!redemptionType) {
    return 'control';
  }

  const experimentName = redemptionTypeExperiments[redemptionType]?.[platformAdapter.platform];

  if (!experimentName) {
    return 'control';
  }

  const experiment = platformAdapter.getAmplitudeFeatureFlag(experimentName) ?? 'control';

  return experiment as Experiment;
};
