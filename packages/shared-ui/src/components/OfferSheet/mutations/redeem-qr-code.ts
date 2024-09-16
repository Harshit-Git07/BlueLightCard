import { useMutation } from '@tanstack/react-query';
import { usePlatformAdapter } from '../../../adapters';
import { type UseRedeemOfferOptions } from './types';
import { redeemOffer } from '../../../api/redemptions';
import events from '../../../utils/amplitude/events';
import { RedemptionType } from '../../../utils/redemptionTypes';

export default function useRedeemQRMutation() {
  const adapter = usePlatformAdapter();

  return useMutation({
    scope: {
      id: 'redeem-vaultQR-offer',
    },
    throwOnError: true,
    mutationKey: ['redeemOffer', adapter.platform],
    mutationFn: async (value: UseRedeemOfferOptions) => {
      const response = await redeemOffer(
        adapter,
        value.offerId,
        value.offerName,
        value.companyName,
      );

      if (response?.redemptionType === RedemptionType.VAULT_QR) {
        return response.redemptionDetails.code;
      }
    },
    onMutate: (variables) => ({
      company_id: variables.companyId,
      company_name: variables.companyName,
      offer_id: variables.offerId,
      offer_name: variables.offerName,
      source: 'sheet',
      origin: adapter.platform,
      design_type: 'modal_popup',
    }),
    onSuccess: (data, variables, context) => {
      adapter.logAnalyticsEvent(events.VAULT_CODE_USE_CODE_CLICKED, context, variables.amplitude);
    },
  });
}
