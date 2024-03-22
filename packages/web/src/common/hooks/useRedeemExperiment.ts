import { useAmplitudeExperimentClient } from '@/context/AmplitudeExperiment';
import { useRedemptionDetails } from './useRedemptionDetails';
import { RedemptionType } from '@/types/api/redemptions';
import { useMemo } from 'react';

function getAmplitudeExperimentName(redemptionType: RedemptionType) {
  switch (redemptionType) {
    case 'generic':
      return 'offer-sheet-redeem-generic';
    case 'preApplied':
      return 'offer-sheet-redeem-preApplied';
    case 'showCard':
      return 'offer-sheet-redeem-showCard';
    case 'vault':
      return 'offer-sheet-redeem-vault';
    case 'vaultQR':
      return 'offer-sheet-redeem-vaultQR';
    default:
      const _: never = redemptionType;
      throw new Error(`Unknown redemption type: ${_}`);
  }
}

export type UseRedeemExperimentResult =
  | {
      status: 'loading';
    }
  | {
      status: 'success';
      data: {
        redemptionType: RedemptionType;
        treatmentEnabled: boolean;
      };
    }
  | {
      status: 'error';
      redemptionDetailsError: Error | null;
      amplitudeExperimentClientError: Error | null;
    };

export function useRedeemExperiment(offerId: number): UseRedeemExperimentResult {
  const redemptionDetailsQuery = useRedemptionDetails(offerId);
  const amplitudeExperimentClientQuery = useAmplitudeExperimentClient();

  return useMemo(() => {
    if (
      redemptionDetailsQuery.status === 'success' &&
      amplitudeExperimentClientQuery.status === 'success'
    ) {
      const amplitudeExperimentName = getAmplitudeExperimentName(
        redemptionDetailsQuery.data.data.redemptionType
      );

      const variant = amplitudeExperimentClientQuery.data.variant(
        amplitudeExperimentName,
        'control'
      );
      console.log('variant: ', variant);

      return {
        status: 'success',
        data: {
          redemptionType: redemptionDetailsQuery.data.data.redemptionType,
          treatmentEnabled: variant.value === 'treatment',
        },
      };
    }

    if (
      redemptionDetailsQuery.status === 'error' ||
      amplitudeExperimentClientQuery.status === 'error'
    ) {
      return {
        status: 'error',
        redemptionDetailsError: redemptionDetailsQuery.error,
        amplitudeExperimentClientError: amplitudeExperimentClientQuery.error,
      };
    }

    if (
      redemptionDetailsQuery.status === 'pending' ||
      amplitudeExperimentClientQuery.status === 'pending'
    ) {
      return {
        status: 'loading',
      };
    }

    throw new Error('unreachable');
  }, [redemptionDetailsQuery, amplitudeExperimentClientQuery]);
}
