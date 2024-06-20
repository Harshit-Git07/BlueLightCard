import { IPlatformAdapter } from '../../adapters';
import { PlatformVariant } from '../../types';
import { RedemptionType } from '../OfferSheet/types';

export const redemptionTypeExperiments: Record<string, Record<PlatformVariant, string | null>> = {
  vault: {
    [PlatformVariant.Web]:
      process.env.NEXT_PUBLIC_AMPLITUDE_EXPERIMENT_REDEMPTION_VAULT_WEB ??
      'offer-sheet-redeem-vault-search-and-homepage-web-2',
    [PlatformVariant.MobileHybrid]: 'offer-sheet-redeem-vault-app',
  },
  generic: {
    [PlatformVariant.Web]: 'offer-sheet-redeem-generic-web',
    [PlatformVariant.MobileHybrid]: 'offer-sheet-redeem-generic-app',
  },
  preApplied: {
    [PlatformVariant.Web]: 'offer-sheet-redeem-preapplied-web',
    [PlatformVariant.MobileHybrid]: 'offer-sheet-redeem-preapplied-app',
  },
  showCard: {
    [PlatformVariant.Web]: 'offer-sheet-redeem-show-card-web',
    [PlatformVariant.MobileHybrid]: 'offer-sheet-redeem-show-card-app',
  },
  vaultQR: {
    [PlatformVariant.Web]: 'offer-sheet-redeem-qr-web',
    [PlatformVariant.MobileHybrid]: 'offer-sheet-redeem-qr-app',
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
