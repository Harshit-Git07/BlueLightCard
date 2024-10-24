import { Amplitude } from './amplitude';
import amplitudeEvents from '@/utils/amplitude/events';

export type LogOfferViewParams = {
  amplitude: Amplitude | null | undefined;
  userUuid?: string;
  eventSource: string;
  origin: string;
  offerId?: number | string;
  offerName?: string;
  companyId?: number | string;
  companyName?: string;
};

export const logOfferView = ({
  amplitude,
  userUuid,
  eventSource,
  origin,
  offerId,
  offerName,
  companyId,
  companyName,
}: LogOfferViewParams) => {
  if (amplitude && offerId) {
    amplitude.setUserId(userUuid ?? '');
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
