import { useMutation } from '@tanstack/react-query';
import { usePlatformAdapter, type IPlatformAdapter } from '../../../adapters';
import { redeemOffer } from '../../../api/redemptions';
import events from '../../../utils/amplitude/events';
import { type UseRedeemOfferOptions } from './types';
import { RedemptionType } from '../../../utils/redemptionTypes';

const handleRedirect = (url: string, platformAdapter: IPlatformAdapter) => {
  const windowHandle = platformAdapter.navigateExternal(url, { target: 'blank' });

  // If the window failed to open, navigate in the same tab
  if (!windowHandle.isOpen()) {
    platformAdapter.navigateExternal(url, { target: 'blank' });
  } else {
    // Check if the window was closed by an ad blocker and fallback to navigating in the same tab
    setTimeout(() => {
      if (!windowHandle.isOpen()) {
        platformAdapter.navigateExternal(url, { target: 'self' });
      }
    });
  }
};

export function useRedeemOfferMutation() {
  const adapter = usePlatformAdapter();

  return useMutation({
    scope: {
      id: 'redeem-vault-offer',
    },
    throwOnError: true,
    mutationKey: ['redeemOffer', adapter.platform],
    mutationFn: async (value: UseRedeemOfferOptions) =>
      redeemOffer(adapter, value.offerId, value.offerName, value.companyName),
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

      if (
        data?.redemptionType === RedemptionType.VAULT ||
        data?.redemptionType === RedemptionType.PRE_APPLIED ||
        data?.redemptionType === RedemptionType.GENERIC
      ) {
        if (data.redemptionDetails.code) {
          adapter.writeTextToClipboard(data.redemptionDetails.code);
        }

        if (data.redemptionDetails.url) {
          handleRedirect(data.redemptionDetails.url, adapter);
        }
      }
    },
  });
}
