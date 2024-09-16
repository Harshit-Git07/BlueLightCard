import type { IPlatformAdapter } from '../../adapters';
import { PlatformVariant } from '../../types';
import type { RedemptionType } from '../OfferSheet/types';

export const redemptionTypeExperiments: Record<string, Record<PlatformVariant, string>> = {
  vault: {
    [PlatformVariant.Web]:
      process.env.NEXT_PUBLIC_AMPLITUDE_EXPERIMENT_REDEMPTION_VAULT_WEB ??
      'offer-sheet-redeem-vault-search-and-homepage-web-2',
    [PlatformVariant.MobileHybrid]: 'offer-sheet-redeem-vault-app',
  },
  nonVault: {
    [PlatformVariant.Web]: 'offer-sheet-redeem-non-vault-web',
    [PlatformVariant.MobileHybrid]: 'offer-sheet-redeem-non-vault-app',
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

  const experimentName =
    redemptionTypeExperiments[redemptionType === 'vault' ? redemptionType : 'nonVault']?.[
      platformAdapter.platform
    ];

  if (!experimentName) {
    return 'control';
  }

  const experiment = platformAdapter.getAmplitudeFeatureFlag(experimentName) ?? 'control';

  return experiment as Experiment;
};
