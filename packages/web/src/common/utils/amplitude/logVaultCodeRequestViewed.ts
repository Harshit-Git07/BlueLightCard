import { Amplitude } from './amplitude';
import amplitudeEvents from '@/utils/amplitude/events';

export type VaultCodeRequestViewedParams = {
  amplitude: Amplitude | null | undefined;
  userUuid: string | undefined;
  eventSource: string;
  origin: string;
  offerId: number;
  offerName?: string;
  companyId?: number;
  companyName?: string;
};

export const logVaultCodeRequestViewed = ({
  amplitude,
  userUuid,
  eventSource,
  origin,
  offerId,
  offerName,
  companyId,
  companyName,
}: VaultCodeRequestViewedParams) => {
  if (!amplitude) {
    return;
  }

  userUuid && amplitude.setUserId(userUuid);
  amplitude.trackEventAsync(amplitudeEvents.VAULT_CODE_REQUEST_VIEWED, {
    company_id: companyId,
    company_name: companyName,
    offer_id: offerId,
    offer_name: offerName,
    source: eventSource,
    origin,
  });
};
