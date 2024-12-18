import type { V2ApisGetOfferResponse, V2ApisGetEventResponse } from '@blc-mono/offers-cms/api';
import { formatDateDMMMYYYY } from '../utils/dates';

type OfferData = V2ApisGetOfferResponse | V2ApisGetEventResponse;
const isTicketOffer = (offer: OfferData): boolean => offer.type === 'ticket';

export function useLabels(offerData: OfferData): string[] {
  if (isTicketOffer(offerData)) return [offerData.type];
  if (!offerData.expires) return [offerData.type].filter(Boolean);

  return [offerData.type, `Expiry: ${formatDateDMMMYYYY(offerData.expires)}`].filter(Boolean);
}
