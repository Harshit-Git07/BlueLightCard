import { Amplitude } from './amplitude';
import amplitudeEvents from '@/utils/amplitude/events';

export const logOfferView = (
  amplitude: Amplitude | null | undefined,
  uuid: string,
  eventSource: string,
  origin: string,
  offerId?: string,
  offerName?: string,
  companyId?: string,
  companyName?: string
) => {
  if (amplitude && offerId) {
    amplitude.setUserId(uuid);
    amplitude.trackEventAsync(amplitudeEvents.OFFER_VIEWED, {
      company_id: companyId,
      company_name: companyName,
      offer_id: offerId,
      offer_name: offerName,
      source: eventSource,
      origin,
    });
  }
};
